import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { AccountModule } from '../src/entities-manager/account/account.module';
import { Account } from '../src/entities-manager/account/entities/account.entity';
import { Utils } from './utils/utils';

describe('AccountController (e2e)', () => {
  let app: INestApplication;
  let accountRepository: Repository<Account>;
  let accountId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountModule, Utils.getDBDynamicModule()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await Utils.initializeAppE2ETest(app);

    accountRepository = getRepository(Account);
  });

  afterAll(async () => {
    await Utils.closeAppE2ETest(app);
  });

  it('/random(GET) must return a new bankAccount', async () => {
    const res = await request(app.getHttpServer()).get('/account/random');
    expect(res.status).toBe(HttpStatus.OK);
    const account: Account = res.body;
    expect(account.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    ); // regex for uuid
    expect(account.iban).toMatch(/^ES\d{22}$/);
    const accountBBDD = await accountRepository.findOne({ id: account.id });
    expect(accountBBDD).toMatchObject(account);
    accountId = account.id;
  });

  describe('/:id(GET)', () => {
    it('when id is found account object must be returned', async () => {
      const res = await request(app.getHttpServer()).get(
        `/account/${accountId}`,
      );
      const account: Account = res.body;
      const accountBBDD = await accountRepository.findOne({ id: account.id });
      expect(accountBBDD).toMatchObject(account);
    });
    it('when id is not found an exception must be returned', async () => {
      const randomId = Utils.chance.guid();
      const res = await request(app.getHttpServer()).get(
        `/account/${randomId}`,
      );
      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(`id ${randomId} not found`);
    });
  });

  it('/(GET) must return all accounts', async () => {
    const res = await request(app.getHttpServer()).get('/account');
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body?.length).toBeGreaterThanOrEqual(1);
    const accounts: Account[] = res.body;
    expect(
      accounts.every(
        (account) => account.iban !== undefined && account.iban !== null,
      ),
    ).toBe(true);
  });
});
