import _ from 'lodash';

export type ESPDevicePartial = {
  [P in keyof ESPDevice]?: ESPDevice[P];
}

export class ESPDevice {
  deviceName: string;
  id: string;
  name: string;
  disc: string;
  idType: number;
  rssiAT1m: number;
  rssi: number;
  raw: number;
  speed: number;
  mac: string;
  interval: number;
  outOfRange: boolean;
  measuredPower: number;

  constructor(props: ESPDevicePartial) {
    this.measuredPower = -59.0;
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }
  }
  get distance(): number {
    if (this.rssi === 0) {
      return undefined;
    }

    const ratio = this.rssi / this.measuredPower;
    if (ratio < 1) {
      return _.round(Math.pow(ratio, 10), 1);
    } else {
      return _.round(0.89976 * Math.pow(ratio, 7.7095) + 0.111, 1);
    }
  }
}
