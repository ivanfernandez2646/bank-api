import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AccountModule } from '../../src/entities-manager/account/account.module';
import { Account } from '../../src/entities-manager/account/entities/account.entity';
import { CreateOperationDto } from '../../src/operation/dto/create-operation.dto';
import { Operation } from '../../src/operation/entities/operation.entity';
import { OperationModule } from '../../src/operation/operation.module';
import { Utils } from '../utils/utils';

describe('Integration (e2e)', () => {
  let app: INestApplication;
  let accountRepository: Repository<Account>;
  let operationRepository: Repository<Operation>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountModule, OperationModule, Utils.getDBDynamicModule()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await Utils.initializeAppE2ETest(app);

    accountRepository = Utils.dataSource.getRepository(Account);
    operationRepository = Utils.dataSource.getRepository(Operation);
  });

  afterAll(async () => {
    await Utils.closeAppE2ETest(app);
  });

  it('create an account, then add few operations and see the operations are in the account', async () => {
    // 1. create account
    const account = await createAccount();

    // 2. create three operations (deposit 10, withdraw 2, error on withdraw)
    const operations = await createOperations(account.id);
    expect(operations.length).toBe(2);

    // 3. get again the account to see his current balance is equal to 8
    const res = await request(app.getHttpServer()).get(
      `/account/${account.id}`,
    );
    expect(res.status).toBe(HttpStatus.OK);
    const accountWithUpdatedBalance: Account = res.body;
    expect(accountWithUpdatedBalance.id).toBe(account.id);
    expect(accountWithUpdatedBalance.operations.length).toBe(2);
    expect(accountWithUpdatedBalance.currentBalance).toBe(8);
  });

  async function createAccount(): Promise<Account> {
    const res = await request(app.getHttpServer()).get('/account/random');
    expect(res.status).toBe(HttpStatus.OK);
    const account: Account = res.body;
    const accountBBDD = await accountRepository.findOne({
      where: { id: account.id },
    });
    expect(accountBBDD).toMatchObject(account);
    return account;
  }

  async function createOperations(accountId: string): Promise<Operation[]> {
    const operations: Operation[] = [];
    const depositDto: CreateOperationDto = {
      accountId,
      amount: 10,
    };
    let res = await request(app.getHttpServer())
      .post('/operation/deposit')
      .send(depositDto);
    expect(res.status).toBe(HttpStatus.CREATED);
    operations.push(res.body);

    const withdrawDto: CreateOperationDto = {
      accountId,
      amount: 2,
    };
    res = await request(app.getHttpServer())
      .post('/operation/withdraw')
      .send(withdrawDto);
    expect(res.status).toBe(HttpStatus.CREATED);
    operations.push(res.body);

    const errorWithdrawDto: CreateOperationDto = {
      accountId,
      amount: 25,
    };
    res = await request(app.getHttpServer())
      .post('/operation/withdraw')
      .send(errorWithdrawDto);
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);

    return operations;
  }
});
