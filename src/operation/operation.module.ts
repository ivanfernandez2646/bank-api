import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../entities-manager/account/account.module';
import { Operation } from './entities/operation.entity';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation]), AccountModule],
  controllers: [OperationController],
  providers: [OperationService],
})
export class OperationModule {}
