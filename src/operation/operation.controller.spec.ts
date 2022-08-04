import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from '../entities-manager/account/account.service';
import { Account } from '../entities-manager/account/entities/account.entity';
import { Operation } from './entities/operation.entity';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

describe('OperationController', () => {
  let controller: OperationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationController],
      providers: [
        OperationService,
        AccountService,
        { provide: getRepositoryToken(Operation), useClass: Operation },
        { provide: getRepositoryToken(Account), useClass: Account },
      ],
    }).compile();

    controller = module.get<OperationController>(OperationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
