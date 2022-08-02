import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfigModuleOptions from './app-config.module.options';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [ConfigModule.forRoot(appConfigModuleOptions)],
  providers: [ConfigService, AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
