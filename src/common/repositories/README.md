# Base Repository Pattern

This project uses a base repository pattern to provide common CRUD operations that can be extended for specific entities.

## Structure

- **`IBaseRepository<T>`** - Interface defining common repository methods
- **`BaseRepository<T>`** - Abstract class implementing the interface
- **Entity-specific repositories** - Extend `BaseRepository` for custom methods

## Usage

### 1. Create Your Entity Repository

Extend `BaseRepository` and inject the TypeORM repository:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YourEntity } from '../entities/your-entity.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class YourEntityRepository extends BaseRepository<YourEntity> {
  constructor(
    @InjectRepository(YourEntity)
    repository: Repository<YourEntity>,
  ) {
    super(repository);
  }

  // Add custom methods specific to your entity
  async findByCustomField(field: string): Promise<YourEntity | null> {
    return this.findOneBy({ where: { customField: field } });
  }
}
```

### 2. Register in Module

Add the repository to your module's providers:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YourEntity } from './entities/your-entity.entity';
import { YourEntityRepository } from './repositories/your-entity.repository';
import { YourEntityService } from './your-entity.service';

@Module({
  imports: [TypeOrmModule.forFeature([YourEntity])],
  providers: [YourEntityService, YourEntityRepository],
  exports: [YourEntityService, YourEntityRepository],
})
export class YourEntityModule {}
```

### 3. Use in Service

Inject and use the repository in your service:

```typescript
import { Injectable } from '@nestjs/common';
import { YourEntityRepository } from './repositories/your-entity.repository';
import { CreateYourEntityDto } from './dto/create-your-entity.dto';

@Injectable()
export class YourEntityService {
  constructor(
    private readonly repository: YourEntityRepository,
  ) {}

  async create(dto: CreateYourEntityDto) {
    return this.repository.create(dto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateYourEntityDto) {
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }
}
```

## Available Base Methods

All repositories extending `BaseRepository` have access to:

### CRUD Operations

- `create(entity: DeepPartial<T>): Promise<T>` - Create a new entity
- `createMany(entities: DeepPartial<T>[]): Promise<T[]>` - Create multiple entities
- `findAll(options?: FindManyOptions<T>): Promise<T[]>` - Find all entities
- `findOne(id: string, options?: FindOneOptions<T>): Promise<T | null>` - Find by ID
- `findOneBy(options: FindOneOptions<T>): Promise<T | null>` - Find by options
- `update(id: string, entity: DeepPartial<T>): Promise<T>` - Update entity
- `remove(id: string): Promise<void>` - Delete entity

### Utility Methods

- `exists(id: string): Promise<boolean>` - Check if entity exists
- `count(options?: FindManyOptions<T>): Promise<number>` - Count entities
- `getRepository(): Repository<T>` - Get underlying TypeORM repository for advanced operations

## Example: User Repository

See `src/modules/users/repositories/user.repository.ts` for a complete example:

```typescript
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  // Custom methods
  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ where: { email } });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.getRepository().count({ where: { email } });
    return count > 0;
  }
}
```

## Benefits

1. **DRY Principle** - No code duplication for common CRUD operations
2. **Consistency** - All repositories follow the same pattern
3. **Type Safety** - Full TypeScript support with generics
4. **Extensibility** - Easy to add custom methods per entity
5. **Maintainability** - Changes to base methods affect all repositories

## Advanced Usage

### Using the Underlying Repository

For complex queries, use `getRepository()`:

```typescript
async complexQuery(): Promise<YourEntity[]> {
  return this.getRepository()
    .createQueryBuilder('entity')
    .leftJoinAndSelect('entity.relation', 'relation')
    .where('entity.field = :value', { value: 'something' })
    .getMany();
}
```

### Custom Find Options

Use TypeORM find options:

```typescript
async findWithRelations(id: string): Promise<YourEntity | null> {
  return this.findOne(id, {
    relations: ['relation1', 'relation2'],
    select: ['id', 'name', 'email'],
  });
}
```
