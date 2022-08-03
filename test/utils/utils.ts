import {
  DynamicModule,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Chance from 'chance';
import { getConnection } from 'typeorm';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { AppConfigModule } from '../../src/configuration/app-config.module';
import { AppConfigService } from '../../src/configuration/app-config.service';
import { generateData } from './generate-data';

export class Utils {
  static chance = new Chance();

  static async initializeAppE2ETest(app: INestApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await this.populateDB(app);
    await app.init();
  }

  static async closeAppE2ETest(app: INestApplication) {
    //await getConnection().dropDatabase();
    await app.close();
  }

  static getDBDynamicModule(
    entities?: (string | EntitySchema<any>)[],
  ): DynamicModule {
    return TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        type: 'postgres',
        host: appConfigService.getDBHost(),
        port: appConfigService.getDBPort(),
        database: appConfigService.getDBName(),
        username: appConfigService.getDBUsername(),
        password: appConfigService.getDBPassword(),
        entities: entities ?? ['./**/*.entity.ts'],
        synchronize: appConfigService.getDBSynchronize(),
      }),
      inject: [AppConfigService],
    });
  }

  static async populateDB(app: INestApplication) {
    await generateData(app, getConnection());
  }
}
