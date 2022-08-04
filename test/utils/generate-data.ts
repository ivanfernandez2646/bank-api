import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AccountService } from '../../src/entities-manager/account/account.service';
import { CreateAccountDto } from '../../src/entities-manager/account/dto/create-account.dto';
import { Account } from '../../src/entities-manager/account/entities/account.entity';
import { OperationType } from '../../src/entities-manager/enums/operation-type.enum';
import { CreateOperationDto } from '../../src/operation/dto/create-operation.dto';
import { Operation } from '../../src/operation/entities/operation.entity';
import { Utils } from './utils';

const countRandomData = 10;
export const accountsMock: Account[] = [];
export const operationsMock: Operation[] = [];

export async function generateData(app: INestApplication, conn: Connection) {
  await insertAccounts(app, conn);
  await insertOperations(app, conn);
}

async function insertAccounts(app: INestApplication, conn: Connection) {
  const accountsRepository = conn.getRepository(Account);
  const accountsService = app.get<AccountService>(AccountService);
  for (let i = 0; i < countRandomData; i++) {
    const account: CreateAccountDto = { iban: accountsService.generateIban() };
    accountsMock.push(accountsRepository.create(account));
  }
  await accountsRepository.save(accountsMock);
}

async function insertOperations(app: INestApplication, conn: Connection) {
  const operationRepository = conn.getRepository(Operation);
  for (let i = 0; i < countRandomData; i++) {
    const operation: CreateOperationDto = {
      amount: Utils.chance.floating({ min: 0.01, max: 9999, fixed: 2 }),
      accountId:
        accountsMock[Math.floor(Math.random() * accountsMock.length)].id, // random account id
    };
    const randomType = Utils.chance.bool()
      ? OperationType.DEPOSIT
      : OperationType.WITHDRAW;
    operationsMock.push(
      operationRepository.create({ ...operation, type: randomType }),
    );
  }
  await operationRepository.save(operationsMock);
}
