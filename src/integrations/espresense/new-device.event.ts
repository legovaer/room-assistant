export class NewDeviceEvent {
  deviceName: string;
  id: string;
  name: string;
  disc: string;
  idType: number;
  rssiAT1m: number;
  rssi: number;
  raw: number;
  distance: number;
  speed: number;
  mac: string;
  interval: number;
  outOfRange: boolean;

  constructor(
    deviceName: string,
    idType: number,
    rssiAT1m: number,
    rssi: number,
    raw: number,
    distance: number,
    speed: number,
    mac: string,
    interval: number,
    outOfRange: boolean = false
  ) {
    this.deviceName = deviceName;
    this.idType = idType;
    this.rssiAT1m = rssiAT1m;
    this.rssi = rssi;
    this.raw = raw;
    this.distance = distance;
    this.speed = speed;
    this.mac = mac;
    this.interval = interval;
    this.outOfRange = outOfRange;
  }
}
