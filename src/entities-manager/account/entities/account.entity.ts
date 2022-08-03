import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @ApiProperty({ description: 'database id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'iban number', minLength: 24, maxLength: 24 })
  @Column({ length: 24, unique: true })
  iban: string;
}
