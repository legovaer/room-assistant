import { mqttScheme, MQTTOptionConfig } from '../mqtt/mqtt.config';
import * as Joi from 'joi';
import * as jf from 'joiful';

class TagOverride {
  @(jf.string().optional())
  id?: string;
  @(jf.string().optional())
  name?: string;
  @(jf.number().negative().optional())
  measuredPower?: number;
  @(jf.number().integer().max(0xffffffff).optional())
  batteryMask?: number;
}

export class EspresenseConfig {
  @(jf.string().uri(mqttScheme).required())
  mqttUrl = 'mqtt://localhost:1883';
  @(jf.object().required())
  mqttOptions: MQTTOptionConfig = new MQTTOptionConfig();
  @(jf.string().required())
  discoveryPrefix = 'espresense/devices/#';
  @(jf.string().required())
  mqttRoomPrefix = 'espresense/rooms/#';
  @(jf.array({ elementClass: String }).required())
  whitelist: string[] = [];
  @(jf.boolean().required())
  whitelistRegex = false;
  @(jf.array({ elementClass: String }).required())
  allowlist: string[] = [];
  @(jf.boolean().required())
  allowlistRegex = false;
  @(jf.array({ elementClass: String }).required())
  blacklist: string[] = [];
  @(jf.boolean().required())
  blacklistRegex = false;
  @(jf.array({ elementClass: String }).required())
  denylist: string[] = [];
  @(jf.boolean().required())
  denylistRegex = false;
  @(jf.object().custom(validateTagOverrides).required())
  tagOverrides: { [entityId: string]: TagOverride } = {};
  @(jf.number().min(0).required())
  timeout = 60;
  @(jf.number().min(0).required())
  updateFrequency = 0;
  @(jf.number().required())
  rssiFactor = 1;
  @(jf.number().positive().optional())
  maxDistance?: number;
  @(jf.number().max(0).required())
  minDiscoveryLogRssi = -999;
  @jf.number().positive().required()
  kalmanProcessNoise = 0.008;
  @jf.number().positive().required()
  kalmanMeasurementNoise = 4;
}

function validateTagOverrides(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .object()
    .pattern(options.joi.string(), jf.getSchema(TagOverride));
}
