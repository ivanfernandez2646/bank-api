import { NotFoundException } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { BaseServiceInterface } from './base-service.interface';

export class BaseService<E, CRDTO> implements BaseServiceInterface {
  constructor(private repository: Repository<E>) {}

  async save(createObject: CRDTO | E): Promise<E> {
    const newResource = this.repository.create(createObject as any);
    const res = await this.repository.save(newResource as any);
    return res;
  }

  async findAll(options?: FindManyOptions): Promise<E[]> {
    const res = await this.repository.find(options);
    return res;
  }

  async findOne(
    id: string,
    options?: FindOneOptions,
    throwError = true,
  ): Promise<E> {
    const res = await this.repository.findOne(id, options);
    if (!res && throwError) {
      throw new NotFoundException(`id ${id} not found`);
    }
    return res;
  }
}
