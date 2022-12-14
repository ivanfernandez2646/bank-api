import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './configuration/app-config.module';
import { AppConfigService } from './configuration/app-config.service';
import { AccountModule } from './entities-manager/account/account.module';
import { OperationModule } from './operation/operation.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        type: 'postgres',
        host: appConfigService.getDBHost(),
        port: appConfigService.getDBPort(),
        database: appConfigService.getDBName(),
        username: appConfigService.getDBUsername(),
        password: appConfigService.getDBPassword(),
        autoLoadEntities: true,
        synchronize: appConfigService.getDBSynchronize(),
      }),
      inject: [AppConfigService],
    }),
    AccountModule,
    OperationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
