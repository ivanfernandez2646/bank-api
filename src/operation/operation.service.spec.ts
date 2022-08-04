import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from '../entities-manager/account/account.service';
import { Account } from '../entities-manager/account/entities/account.entity';
import { Operation } from './entities/operation.entity';
import { OperationService } from './operation.service';

describe('OperationService', () => {
  let service: OperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationService,
        AccountService,
        { provide: getRepositoryToken(Operation), useClass: Operation },
        { provide: getRepositoryToken(Account), useClass: Account },
      ],
    }).compile();

    service = module.get<OperationService>(OperationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkWithdrawAvailable', () => {
    it('when amount is greater than currentBalance then an error must be thrown', () => {
      expect(() => service.checkWithdrawAvailable(200.01, 200)).toThrowError(
        'withdrawal amount has exceeded your account balance',
      );
    });

    it('when amount is equal than currentBalance then undefined must be returned', () => {
      expect(service.checkWithdrawAvailable(200, 200)).toBe(undefined);
    });

    it('when amount is less than currentBalance then undefined must be returned', () => {
      expect(service.checkWithdrawAvailable(199.99, 200)).toBe(undefined);
    });
  });
});
