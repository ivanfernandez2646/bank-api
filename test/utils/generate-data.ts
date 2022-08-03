import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AccountService } from '../../src/entities-manager/account/account.service';
import { CreateAccountDto } from '../../src/entities-manager/account/dto/create-account.dto';
import { Account } from '../../src/entities-manager/account/entities/account.entity';

const countRandomData = 10;
export const accountsMock: Account[] = [];

export async function generateData(app: INestApplication, conn: Connection) {
  await insertAccounts(app, conn);
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
