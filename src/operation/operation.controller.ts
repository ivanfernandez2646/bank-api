import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OperationType } from '../entities-manager/enums/operation-type.enum';
import { CreateOperationDto } from './dto/create-operation.dto';
import { Operation } from './entities/operation.entity';
import { OperationService } from './operation.service';

@Controller('operation')
@ApiTags('operation')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post(`/${OperationType.WITHDRAW}`)
  @ApiResponse({
    type: Operation,
    description: 'Withdraw operation created',
    status: HttpStatus.CREATED,
  })
  async withdraw(
    @Body() createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    return this.operationService.saveOperation(
      createOperationDto,
      OperationType.WITHDRAW,
    );
  }

  @Post(`/${OperationType.DEPOSIT}`)
  @ApiResponse({
    type: Operation,
    description: 'Deposit operation created',
    status: HttpStatus.CREATED,
  })
  async deposit(
    @Body() createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    return this.operationService.saveOperation(
      createOperationDto,
      OperationType.DEPOSIT,
    );
  }
}
