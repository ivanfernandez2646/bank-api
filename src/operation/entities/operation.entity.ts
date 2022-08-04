import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../entities-manager/account/entities/account.entity';
import { OperationType } from '../../entities-manager/enums/operation-type.enum';
import { ColumnNumericTransformer } from '../../helpers/dto-transfomers';

@Entity()
export class Operation {
  @ApiProperty({ description: 'Database id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: OperationType, description: `Type of operation` })
  @Column({ enum: OperationType })
  type: OperationType;

  @ApiProperty({ description: 'Amount' })
  @Column({
    type: 'numeric',
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @ApiProperty({ description: 'Date of operation' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiPropertyOptional({ description: 'Destination account id' })
  @Column({ type: 'uuid' })
  accountId?: string;

  @ApiPropertyOptional({
    type: () => Account,
  })
  @ManyToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: 'accountId' })
  account?: Account;
}
