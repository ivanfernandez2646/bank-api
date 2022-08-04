import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Operation } from '../../../operation/entities/operation.entity';

@Entity()
export class Account {
  @ApiProperty({ description: 'Database id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'IBAN number', minLength: 24, maxLength: 24 })
  @Column({ length: 24, unique: true })
  iban: string;

  // TODO: store in BBDD in a future
  @ApiProperty({ description: 'Current balance' })
  currentBalance: number;

  @ApiPropertyOptional({
    type: () => Operation,
    isArray: true,
  })
  @OneToMany(() => Operation, (operation) => operation.account)
  operations?: Operation[];
}
