import { RoomPresenceDistanceSensor } from '../../integration-support/room-presence/room-presence-distance.sensor';

class EspresenseMeasurement {
  rssi: number;
  measuredPower: number;

  constructor(rssi: number, measuredPower: number) {
    this.rssi = rssi;
    this.measuredPower = measuredPower;
  }
}

export class EspresensePresenceSensor extends RoomPresenceDistanceSensor {
  measuredValues: { [instance: string]: EspresenseMeasurement } = {};
  batteryLevel?: number;

  handleNewMeasurement(
    instanceName: string,
    rssi: number,
    measuredPower: number,
    distance: number,
    outOfRange: boolean,
    batteryLevel?: number
  ): void {
    this.measuredValues[instanceName] = new EspresenseMeasurement(
      rssi,
      measuredPower
    );
    this.handleNewDistance(instanceName, distance, outOfRange);
    if (batteryLevel !== undefined) this.batteryLevel = batteryLevel;
  }
}
