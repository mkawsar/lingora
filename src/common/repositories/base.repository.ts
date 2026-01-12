import { Injectable } from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
} from 'typeorm';
import { IBaseRepository } from '../interfaces/base-repository.interface';
import { NotFoundException } from '@nestjs/common';

/**
 * Base repository class implementing common CRUD operations
 * @template T - Entity type (must extend ObjectLiteral for TypeORM)
 */
@Injectable()
export abstract class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Create a new entity
   */
  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  /**
   * Create multiple entities
   */
  async createMany(entities: DeepPartial<T>[]): Promise<T[]> {
    const newEntities = this.repository.create(entities);
    return this.repository.save(newEntities);
  }

  /**
   * Find all entities
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * Find one entity by ID
   */
  async findOne(id: string, options?: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as any,
      ...options,
    });
  }

  /**
   * Find one entity by options
   */
  async findOneBy(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  /**
   * Update an entity
   */
  async update(id: string, entity: DeepPartial<T>): Promise<T> {
    const existingEntity = await this.findOne(id);
    
    if (!existingEntity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    Object.assign(existingEntity, entity);
    return this.repository.save(existingEntity);
  }

  /**
   * Delete an entity by ID
   */
  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    await this.repository.remove(entity);
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as any,
    } as FindManyOptions<T>);
    return count > 0;
  }

  /**
   * Count entities
   */
  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  /**
   * Get the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<T> {
    return this.repository;
  }
}
