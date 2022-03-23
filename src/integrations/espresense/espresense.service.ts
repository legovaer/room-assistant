import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { Peripheral } from '@mkerix/noble';
import { ConfigService } from '../../config/config.service';
import mqtt, { AsyncMqttClient } from 'async-mqtt';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';
import { EspresenseConfig } from './espresense.config';
import { RoomPresenceProxyHandler } from '../../integration-support/room-presence/room-presence.proxy';
import * as util from 'util';
import { exec } from 'child_process';
import { Node } from 'democracy';
import { NewRssiEvent } from '../bluetooth-classic/new-rssi.event';
import { NewDistanceEvent } from '../bluetooth-low-energy/new-distance.event';
import _ from 'lodash';
import { DeviceTracker } from '../../entities/device-tracker';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import { DeviceTrackerConfig } from '../home-assistant/device-tracker-config';
import { Device } from '../home-assistant/device';
import { Sensor } from '../../entities/sensor';
import {
  NEW_RSSI_CHANNEL,
  REQUEST_RSSI_CHANNEL,
} from '../bluetooth-classic/bluetooth-classic.const';
import {
  AvailabilityStatus,
  EntityConfig,
  PROPERTY_DENYLIST,
} from '../home-assistant/entity-config';
import { RoomPresenceDistanceSensor } from '../../integration-support/room-presence/room-presence-distance.sensor';
import { KalmanFilterable } from '../../util/filters';
import { makeId } from '../../util/id';
import { DISTRIBUTED_DEVICE_ID } from '../home-assistant/home-assistant.const';
import { Device as DeviceInfo } from '../home-assistant/device';
import { Switch } from '../../entities/switch';
import { EspresensePresenceSensor } from './espresense-presence.sensor';
import { NewDeviceEvent } from './new-device.event';
import { BluetoothLowEnergyService } from '../bluetooth-low-energy/bluetooth-low-energy.service';
import { Tag } from '../bluetooth-low-energy/tag';
import { BluetoothLowEnergyConfig } from '../bluetooth-low-energy/bluetooth-low-energy.config';
import { BluetoothLowEnergyPresenceSensor } from '../bluetooth-low-energy/bluetooth-low-energy-presence.sensor';
export const NEW_DISTANCE_CHANNEL = 'espresense.new-distance';
const INSTANCE_STATUS_BASE_TOPIC = 'room-assistant/status';

@Injectable()
export class EspresenseService
  extends KalmanFilterable(
    Object,
    'espresense.kalmanProcessNoise',
    'espresense.kalmanMeasurementNoise'
  )
  implements OnModuleInit
{
  private readonly config: EspresenseConfig;
  private readonly bleConfig: BluetoothLowEnergyConfig;
  private rotationOffset = 0;
  private inquiriesSwitch: Switch;
  private deviceMap = new Map<string, Device>();
  private mqttClient?: AsyncMqttClient;
  private readonly statusTopic: string;
  private readonly logger: Logger;
  private readonly loggedRooms = new Set<string>();
  private readonly loggedIds = new Set<string>();
  private tagUpdaters: {
    [tagId: string]: (event: NewDistanceEvent) => void;
  } = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly entitiesService: EntitiesService,
    private readonly clusterService: ClusterService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    super();
    this.config = this.configService.get('espresense');
    this.bleConfig = this.configService.get('bluetoothLowEnergy');
    this.logger = new Logger(EspresenseService.name);
    const instanceName = this.configService.get('global').instanceName;
    this.statusTopic = `${INSTANCE_STATUS_BASE_TOPIC}/${makeId(instanceName)}`;
  }
  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  async onModuleInit(): Promise<void> {
    //this.clusterService.on('elected', this.listenMQTT.bind(this));
    //this.clusterService.on('leader', this.listenMQTT.bind(this));
    try {
      this.mqttClient = await mqtt.connectAsync(
        this.config.mqttUrl,
        {
          will: {
            topic: this.statusTopic,
            payload: 'offline',
            retain: false,
            qos: 1,
            properties: {
              willDelayInterval: 60,
            },
          },
          ...this.config.mqttOptions,
        },
        false
      );

      this.mqttClient.on('error', (e) => this.logger.error(e.message, e.stack));
      this.mqttClient.on('connect', this.handleReconnect.bind(this));

      this.logger.log('Subscribing to Espresense topics....');
      this.mqttClient.subscribe(this.config.discoveryPrefix);
      this.mqttClient.on('message', this.handleIncomingMessage.bind(this));
      this.logger.log(
        `Successfully connected to MQTT broker at ${this.config.mqttUrl}`
      );
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }


  /**
   * Handles broker re-connection events.
   */
  private handleReconnect(): void {
    this.logger.log('Re-connected to broker');
  }

  /**
   * Checks if room-assistant is connected to the MQTT broker.
   */
  isConnected(): boolean {
    return this.mqttClient?.connected;
  }

  /**
   * Executes a stored command based on the topic and content of a MQTT message.
   *
   * @param topic - Topic that the message was received on
   * @param message - Buffer containing the received message as a string
   */
  handleIncomingMessage(topic: string, message: Buffer): void {
    this.logger.debug(
      `Received MQTT message ${message.toString()} on ${topic}`
    );
    const tagData = JSON.parse(message.toString());
    const type = tagData.id.split(':')[0];

    if (type == 'roomAssistant') {
      const appId = tagData.id.split(':')[1];
      const espRoom = 'esp-' + topic.split('/').pop();
      if (
        !this.loggedIds.has(appId) &&
        tagData.rssi >= this.config.minDiscoveryLogRssi
      ) {
        this.logger.log(
          `Espresense reported a roomAssistant object ${tagData.name} with ID ${appId} and RSSI ${tagData.rssi} in room ${espRoom}`
        );
        this.loggedIds.add(appId);
      }

      let rssi = tagData.rssi * this.config.rssiFactor;
      rssi = this.filterRssi(appId, rssi);

      const event = new NewDistanceEvent(
        espRoom,
        appId,
        tagData.name,
        tagData.id,
        rssi,
        0,
        tagData.distance,
        tagData.distance > this.config.maxDistance,
        appId
      );

      if (!this.tagUpdaters.hasOwnProperty(tagData.mac)) {
        this.tagUpdaters[tagData.mac] = _.throttle(
          (event: NewDistanceEvent) => {
            this.handleNewDistance(event);
            this.clusterService.publish(NEW_DISTANCE_CHANNEL, event);
          },
          this.config.updateFrequency * 1000
        );
      }

      this.tagUpdaters[tagData.mac](event);
    }
  }

  /**
   * Applies the Kalman filter based on the historic values with the same tag id.
   *
   * @param tagId - Tag id that matches the measured device
   * @param rssi - Measured signal strength
   * @returns Smoothed signal strength value
   */
  filterRssi(tagId: string, rssi: number): number {
    return this.kalmanFilter(rssi, tagId);
  }
  /**
   * Passes newly found discovery information to aggregated room presence sensors.
   *
   * @param event - Event with new distance/battery data
   */
  handleNewDistance(event: NewDistanceEvent): void {
    const sensorId = makeId(`ble ${event.tagId}`);
    let sensor: BluetoothLowEnergyPresenceSensor;

    if (this.entitiesService.has(sensorId)) {
      sensor = this.entitiesService.get(
        sensorId
      ) as BluetoothLowEnergyPresenceSensor;
    } else {
      sensor = this.createRoomPresenceSensor(
        sensorId,
        event.tagId,
        event.tagName,
        false
      );
    }
    sensor.handleNewMeasurement(
      event.instanceName,
      event.rssi,
      event.measuredPower,
      event.distance,
      event.outOfRange,
      event.batteryLevel
    );
  }

  /**
   * Creates and registers a new room presence sensor and device tracker.
   *
   * @param sensorId - Id that the sensor should receive
   * @param deviceId - Id of the BLE peripheral
   * @param deviceName - Name of the BLE peripheral
   * @param hasBattery - Ability to report battery
   * @returns Registered room presence sensor
   */
  protected createRoomPresenceSensor(
    sensorId: string,
    deviceId: string,
    deviceName: string,
    hasBattery: boolean
  ): BluetoothLowEnergyPresenceSensor {
    const deviceInfo: Device = {
      identifiers: deviceId,
      name: deviceName,
      viaDevice: DISTRIBUTED_DEVICE_ID,
    };

    const deviceTracker = this.createDeviceTracker(
      makeId(`${sensorId}-tracker`),
      `${deviceName} Tracker`,
      deviceInfo
    );

    let batterySensor: Sensor;

    const sensorName = `${deviceName} Room Presence`;
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:raspberry-pi',
          device: deviceInfo,
        },
      },
    ];
    const rawSensor = new BluetoothLowEnergyPresenceSensor(
      sensorId,
      sensorName,
      this.config.timeout
    );
    const proxiedSensor = new Proxy<RoomPresenceDistanceSensor>(
      rawSensor,
      new RoomPresenceProxyHandler(deviceTracker, batterySensor)
    );
    const sensor = this.entitiesService.add(
      proxiedSensor,
      customizations
    ) as BluetoothLowEnergyPresenceSensor;

    const interval = setInterval(
      sensor.updateState.bind(sensor),
      this.config.timeout * 1000
    );
    this.schedulerRegistry.addInterval(`${sensorId}_timeout_check`, interval);

    return sensor;
  }

  /**
   * Creates and registers a new device tracker.
   *
   * @param id - Entity ID for the new device tracker
   * @param name - Name for the new device tracker
   * @param deviceInfo - Reference information about the BLE device
   * @returns Registered device tracker
   */
  protected createDeviceTracker(
    id: string,
    name: string,
    deviceInfo: Device
  ): DeviceTracker {
    const trackerCustomizations: Array<EntityCustomization<any>> = [
      {
        for: DeviceTrackerConfig,
        overrides: {
          device: deviceInfo,
        },
      },
    ];
    return this.entitiesService.add(
      new DeviceTracker(id, name, true),
      trackerCustomizations
    ) as DeviceTracker;
  }

  /**
   * Determines whether an allowlist has been configured or not.
   *
   * @returns Allowlist status
   */
  isAllowlistEnabled(): boolean {
    return (
      this.config.allowlist?.length > 0 || this.config.whitelist?.length > 0
    );
  }

  /**
   * Determines whether a denylist has been configured or not.
   *
   * @returns Denylist status
   */
  isDenylistEnabled(): boolean {
    return (
      this.config.denylist?.length > 0 || this.config.blacklist?.length > 0
    );
  }

  /**
   * Checks if an id is on the allowlist of this component.
   *
   * @param id - Device id
   * @return Whether the id is on the allowlist or not
   */
  isOnAllowlist(id: string): boolean {
    const allowlist = [
      ...(this.config.allowlist || []),
      ...(this.config.whitelist || []),
    ];
    if (allowlist.length === 0) {
      return false;
    }

    return this.config.allowlistRegex || this.config.whitelistRegex
      ? allowlist.some((regex) => id.match(regex))
      : allowlist
          .map((x) => String(x).toLowerCase())
          .includes(id.toLowerCase());
  }

  /**
   * Checks if an id is on the denylist of this component.
   *
   * @param id - Device id
   * @return Whether the id is on the denylist or not
   */
  isOnDenylist(id: string): boolean {
    const denylist = [
      ...(this.config.denylist || []),
      ...(this.config.blacklist || []),
    ];
    if (denylist.length === 0) {
      return false;
    }

    return this.config.denylistRegex || this.config.blacklistRegex
      ? denylist.some((regex) => id.match(regex))
      : denylist.map((x) => String(x).toLowerCase()).includes(id.toLowerCase());
  }
}
