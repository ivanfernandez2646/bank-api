import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getAppEnv(): string {
    return this.configService.get<string>('appEnv');
  }

  getAppPort(): number {
    return this.configService.get<number>('port');
  }

  getDBHost(): string {
    return this.configService.get<string>('database.host');
  }

  getDBPort(): number {
    return this.configService.get<number>('database.port');
  }

  getDBName(): string {
    return this.configService.get<string>('database.name');
  }

  getDBUsername(): string {
    return this.configService.get<string>('database.username');
  }

  getDBPassword(): string {
    return this.configService.get<string>('database.password');
  }

  getDBSynchronize(): boolean {
    return this.configService.get<boolean>('database.synchronize');
  }
}
