import './env';
import { DynamicModule, Module } from '@nestjs/common';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ClusterModule } from '../../cluster/cluster.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EspresenseService } from './espresense.service';

@Module({})
export default class EspresenseModule {
  static forRoot(): DynamicModule {
    return {
      module: EspresenseModule,
      imports: [
        EntitiesModule,
        ConfigModule,
        ClusterModule,
        ScheduleModule.forRoot(),
      ],
      providers: [EspresenseService],
    };
  }
}
