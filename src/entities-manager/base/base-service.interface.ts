import { FindManyOptions, FindOneOptions } from 'typeorm';

export interface BaseServiceInterface {
  save(createDto: unknown): Promise<unknown>;
  findAll(options?: FindManyOptions): Promise<unknown[]>;
  findOne(id: string, options?: FindOneOptions): Promise<unknown>;
}
