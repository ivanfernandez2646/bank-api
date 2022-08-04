import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Operation } from '../../operation/entities/operation.entity';
import { OperationType } from '../enums/operation-type.enum';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: getRepositoryToken(Account), useClass: Account },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateIban must return a new bank account IBAN in spanish format', () => {
    const newIban = service.generateIban();
    expect(newIban).toMatch(/^ES\d{22}$/);
  });

  describe('calculateBalance', () => {
    it('when operations is an array with values then must calculate the balance in function of the type of operation', () => {
      const balance = service.calculateBalance([
        { amount: 20.3, type: OperationType.DEPOSIT },
        { amount: 10.32, type: OperationType.WITHDRAW },
      ] as Operation[]);
      expect(balance).toBe(20.3 - 10.32);
    });

    it('when operations is an empty array or undefined then 0 must be returned', () => {
      const balanceZero = service.calculateBalance([]);
      expect(balanceZero).toBe(0);
    });
  });
});
