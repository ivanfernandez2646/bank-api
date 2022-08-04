import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateOperationDto {
  @ApiPropertyOptional({
    description: 'Amount. Always will be positive no matter operation type',
    minimum: 0.01,
  })
  @IsOptional()
  @Min(0.01)
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: 'Destination account id' })
  @IsUUID()
  accountId?: string;
}
