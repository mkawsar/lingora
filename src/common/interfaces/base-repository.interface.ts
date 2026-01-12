import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

/**
 * Base repository interface for common CRUD operations
 * @template T - Entity type
 */
export interface IBaseRepository<T> {
  /**
   * Create a new entity
   * @param entity - Entity data to create
   * @returns Created entity
   */
  create(entity: DeepPartial<T>): Promise<T>;

  /**
   * Create multiple entities
   * @param entities - Array of entity data to create
   * @returns Array of created entities
   */
  createMany(entities: DeepPartial<T>[]): Promise<T[]>;

  /**
   * Find all entities
   * @param options - Optional find options
   * @returns Array of entities
   */
  findAll(options?: FindManyOptions<T>): Promise<T[]>;

  /**
   * Find one entity by ID
   * @param id - Entity ID (UUID string)
   * @param options - Optional find options
   * @returns Entity or null if not found
   */
  findOne(id: string, options?: FindOneOptions<T>): Promise<T | null>;

  /**
   * Find one entity by options
   * @param options - Find options
   * @returns Entity or null if not found
   */
  findOneBy(options: FindOneOptions<T>): Promise<T | null>;

  /**
   * Update an entity
   * @param id - Entity ID (UUID string)
   * @param entity - Partial entity data to update
   * @returns Updated entity
   */
  update(id: string, entity: DeepPartial<T>): Promise<T>;

  /**
   * Delete an entity by ID
   * @param id - Entity ID (UUID string)
   * @returns void
   */
  remove(id: string): Promise<void>;

  /**
   * Check if entity exists
   * @param id - Entity ID (UUID string)
   * @returns true if exists, false otherwise
   */
  exists(id: string): Promise<boolean>;

  /**
   * Count entities
   * @param options - Optional find options
   * @returns Number of entities
   */
  count(options?: FindManyOptions<T>): Promise<number>;
}
