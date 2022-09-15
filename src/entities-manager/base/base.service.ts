import { NotFoundException } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { BaseServiceInterface } from './base-service.interface';

export class BaseService<E, CRDTO> implements BaseServiceInterface {
  constructor(private repository: Repository<E>) {}

  /**
   * Create and save an entity in BBDD
   * @param createObject
   * @returns object saved in BBDD
   */
  async save(createObject: CRDTO | E): Promise<E> {
    const newResource = this.repository.create(createObject as any);
    const res = await this.repository.save(newResource as any);
    return res;
  }

  /**
   * Get all objects for an entity
   * @param options
   * @returns all objects for the entity in BBDD
   */
  async findAll(options?: FindManyOptions): Promise<E[]> {
    const res = await this.repository.find(options);
    return res;
  }

  /**
   * Get the object for an entity id or throw an exception
   * @param id
   * @param options
   * @param throwError
   * @returns object for given entity id
   * @throws {NotFoundException}
   */
  async findOne(
    id: string,
    options?: FindOneOptions<any>,
    throwError = true,
  ): Promise<E> {
    const res = await this.repository.findOne({
      ...{ where: { id } as any },
      ...options,
    } as FindOneOptions<E>);
    if (!res && throwError) {
      throw new NotFoundException(`id ${id} not found`);
    }
    return res;
  }
}
