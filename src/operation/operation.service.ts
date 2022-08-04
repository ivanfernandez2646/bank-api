import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../entities-manager/account/account.service';
import { BaseService } from '../entities-manager/base/base.service';
import { OperationType } from '../entities-manager/enums/operation-type.enum';
import { CreateOperationDto } from './dto/create-operation.dto';
import { Operation } from './entities/operation.entity';

@Injectable()
export class OperationService extends BaseService<
  Operation,
  CreateOperationDto
> {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    private accountService: AccountService,
  ) {
    super(operationRepository);
  }

  async saveOperation(
    createOperationDto: CreateOperationDto,
    type: OperationType,
  ): Promise<Operation> {
    const account = await this.accountService.findOne(
      createOperationDto.accountId,
    );

    if (type === OperationType.WITHDRAW) {
      this.checkWithdrawAvailable(
        createOperationDto.amount,
        account.currentBalance,
      );
    }

    const res = await super.save({
      ...createOperationDto,
      type,
    });
    return res;
  }

  checkWithdrawAvailable(amount: number, currentBalance: number) {
    const leftAmount = currentBalance - amount;
    if (leftAmount < 0) {
      throw new BadRequestException(
        `withdrawal amount has exceeded your account balance`,
      );
    }
  }
}
