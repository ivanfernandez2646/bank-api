import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/random')
  @ApiResponse({
    type: Account,
    description: 'Account generated',
    status: HttpStatus.OK,
  })
  generateRandom(): Promise<Account> {
    return this.accountService.generateRandom();
  }

  @Get()
  @ApiResponse({
    type: Account,
    isArray: true,
    description: 'Accounts',
    status: HttpStatus.OK,
  })
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    type: Account,
    description: 'Account',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  findOne(@Param('id') id: string): Promise<Account> {
    return this.accountService.findOne(id);
  }
}
