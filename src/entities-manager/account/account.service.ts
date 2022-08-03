import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
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

  generateRandom(): Promise<Account> {
    const newIban = this.generateIban();
    const createAccountDto: CreateAccountDto = { iban: newIban };
    const res = this.save(createAccountDto);
    return res;
  }

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
