import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Operation } from '../../operation/entities/operation.entity';
import { BaseService } from '../base/base.service';
import { OperationType } from '../enums/operation-type.enum';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService extends BaseService<Account, CreateAccountDto> {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {
    super(accountRepository);
  }

  /**
   * Generate random account entity
   * @returns account saved in BBDD
   */
  generateRandomAccount(): Promise<Account> {
    const newIban = this.generateIban();
    const createAccountDto: CreateAccountDto = { iban: newIban };
    const res = this.save(createAccountDto);
    return res;
  }

  /**
   * Find and retrive an account given an id
   * @param id
   * @param options
   * @param throwError
   * @returns account with his currentBalance calculated
   */
  async findOne(
    id: string,
    options?: FindOneOptions<any>,
    throwError?: boolean,
  ): Promise<Account> {
    const account = await super.findOne(
      id,
      { ...options, relations: ['operations'] },
      throwError,
    );
    account.currentBalance = this.calculateBalance(account.operations);
    return account;
  }

  /**
   * Find and retrive all accounts
   * @param options
   * @returns accounts with his currentBalance calculated
   */
  async findAll(options?: FindManyOptions<any>): Promise<Account[]> {
    const accounts = await super.findAll({
      ...options,
      relations: ['operations'],
    });
    accounts.forEach(
      (account) =>
        (account.currentBalance = this.calculateBalance(account.operations)),
    );
    return accounts;
  }

  // TODO: in a future it will be stored in BBDD. for now it will be calculated to avoid spend so much time
  /**
   * Calculate balance for an account given its operations
   * @param operations
   * @returns balance number with 2 decimal popsitions
   */
  calculateBalance(operations: Operation[]): number {
    const amounts = operations.map((op) =>
      op.type === OperationType.DEPOSIT ? op.amount : -op.amount,
    );

    const balance =
      amounts?.length === 0
        ? 0
        : Number(
            amounts
              .reduce((amount, nextAmount) => amount + nextAmount)
              .toFixed(2),
          );
    return balance;
  }

  /**
   * Generate random IBAN (spanish)
   * @returns random spanish IBAN
   */
  generateIban(): string {
    const random11DigitString = () =>
      String(Math.floor(Math.random() * 100000000000)).padStart(11, '0');
    const randomIbanDigits = new Array(2)
      .fill(null)
      .map(random11DigitString)
      .join('');
    return `ES${randomIbanDigits}`;
  }
}
