
import _, { max } from 'lodash';

export type EspStatus = 'ON' | 'OFF';

export class ESPTelemetry {
  ip: string;
  uptime: number;
  firm: string;
  rssi: number;
  ver: string;
  adverts: number;
  seen: number;
  queried: number;
  reported: number;
  freeHeap: number;
  maxAllocHeap: number;
  lastUpdate: number;
  _self = this;

  constructor(props: ESPTelemetryPartial) {
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }
  }

}

export type ESPTelemetryPartial = {
  [P in keyof ESPTelemetry]?: ESPTelemetry[P];
}
export type ESPRoomPartial = {
  [P in keyof ESPRoom]?: ESPRoom[P];
}

export class ESPRoom {
  uniqueId: string;
  private maxDistance: number;
  private statusLed: EspStatus;
  private otaUpdate: EspStatus;
  private autoUpdate: EspStatus;
  private prerelease: EspStatus;
  private activeScan: EspStatus;
  private absorption: number;
  private arduinoOTA: EspStatus;

  constructor(
    private name: string,
  ) {
    this.uniqueId = 'room-assistant-' + this.name;
    // -59 is a somewhat reasonable default
  }

  assign (props: ESPRoomPartial): void {
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }
  }

  set telemetry(telemetry: ESPTelemetryPartial) {
    this.telemetry = new ESPTelemetry(telemetry);
  }

  get telemetry(): ESPTelemetry {
    return this.telemetry;
  }

}
