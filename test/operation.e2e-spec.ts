import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AccountModule } from '../src/entities-manager/account/account.module';
import { CreateOperationDto } from '../src/operation/dto/create-operation.dto';
import { Operation } from '../src/operation/entities/operation.entity';
import { OperationModule } from '../src/operation/operation.module';
import { accountsMock } from './utils/generate-data';
import { Utils } from './utils/utils';

describe('OperationController (e2e)', () => {
  let app: INestApplication;
  let operationRepository: Repository<Operation>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OperationModule, AccountModule, Utils.getDBDynamicModule()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await Utils.initializeAppE2ETest(app);

    operationRepository = Utils.dataSource.getRepository(Operation);
  });

  afterAll(async () => {
    await Utils.closeAppE2ETest(app);
  });

  describe('/deposit', () => {
    it('when accountId do not match to any account an error must be thrown', async () => {
      const randomAccountId = Utils.chance.guid();
      const createOperationDto: CreateOperationDto = {
        accountId: randomAccountId,
        amount: 10,
      };
      const res = await request(app.getHttpServer())
        .post('/operation/deposit')
        .send(createOperationDto);
      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(`id ${randomAccountId} not found`);
    });

    it('when accountId matches to any account must return a new operation created', async () => {
      const createOperationDto: CreateOperationDto = {
        accountId: accountsMock[0].id,
        amount: 10,
      };
      const res = await request(app.getHttpServer())
        .post('/operation/deposit')
        .send(createOperationDto);
      expect(res.status).toBe(HttpStatus.CREATED);
      const operation: Operation = res.body;
      expect(operation.id).not.toBeUndefined();
      expect(operation.accountId).toBe(createOperationDto.accountId);
      const operationBBDD = await operationRepository.findOne({
        where: { id: operation.id },
      });

      // format date from BBDD to ISO string because the format in the output DTO for a date is an string
      expect({
        ...operationBBDD,
        date: operationBBDD.date.toISOString(),
      }).toMatchObject(operation);
    });
  });

  describe('/withdraw', () => {
    it('when accountId do not match to any account an error must be thrown', async () => {
      const randomAccountId = Utils.chance.guid();
      const createOperationDto: CreateOperationDto = {
        accountId: randomAccountId,
        amount: 10,
      };
      const res = await request(app.getHttpServer())
        .post('/operation/withdraw')
        .send(createOperationDto);
      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(`id ${randomAccountId} not found`);
    });

    it('when accountId matches to any account must return a new withdraw operation created', async () => {
      const createOperationDto: CreateOperationDto = {
        accountId: accountsMock[0].id,
        amount: 10,
      };
      const res = await request(app.getHttpServer())
        .post('/operation/withdraw')
        .send(createOperationDto);
      expect(res.status).toBe(HttpStatus.CREATED);
      const operation: Operation = res.body;
      expect(operation.id).not.toBeUndefined();
      expect(operation.accountId).toBe(createOperationDto.accountId);
      const operationBBDD = await operationRepository.findOne({
        where: { id: operation.id },
      });

      // format date from BBDD to ISO string because the format in the output DTO for a date is an string
      expect({
        ...operationBBDD,
        date: operationBBDD.date.toISOString(),
      }).toMatchObject(operation);
    });
  });
});
