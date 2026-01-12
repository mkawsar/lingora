# Database Migrations Guide

This project uses **TypeORM migrations** to manage database schema changes. Auto-sync is **disabled** to ensure database changes are controlled and versioned.

## Configuration

- ✅ `synchronize: false` - Auto-sync is disabled
- ✅ All schema changes must be done through migrations
- ✅ Migration files are stored in `src/database/migration/`

## Migration Workflow

### 1. Generate Migration (Auto-detect changes)

After modifying your entities, generate a migration that detects the differences:

```bash
npm run migration:generate -- src/database/migration/CreateUserTable
```

This will:
- Compare your entities with the current database state
- Generate a migration file in `src/database/migration/`
- Include all changes (new tables, columns, indexes, etc.)

**Example:** After creating/updating `user.entity.ts`, run:
```bash
npm run migration:generate -- src/database/migration/CreateUserTable
```

**Note:** The path must be the full path including the migration directory and filename.

### 2. Review the Generated Migration

Check the generated migration file in `src/database/migration/`:
- Review the SQL statements
- Ensure all changes are correct
- Modify if needed

### 3. Run Migrations

Apply migrations to your database:

```bash
npm run migration:run
```

This will:
- Execute all pending migrations
- Update your database schema
- Track executed migrations in the `migrations` table

### 4. Revert Migration (if needed)

To undo the last migration:

```bash
npm run migration:revert
```

## Creating Manual Migrations

If you need to create an empty migration file to write custom SQL:

```bash
npm run migration:create -- src/database/migration/AddCustomIndex
```

Then edit the file in `src/database/migration/` to add your custom SQL.

## Important Notes

⚠️ **Never enable `synchronize: true` in production!**

- Auto-sync can cause data loss
- Migrations provide version control for database changes
- Migrations can be reviewed before applying
- Migrations can be rolled back if needed

## Example Workflow

1. **Modify Entity:**
   ```typescript
   // user.entity.ts - Add new column
   @Column()
   phoneNumber: string;
   ```

2. **Generate Migration:**
   ```bash
   npm run migration:generate -- src/database/migration/AddPhoneNumberToUser
   ```

3. **Review Migration File:**
   ```typescript
   // Check src/database/migration/XXXXXX-AddPhoneNumberToUser.ts
   ```

4. **Run Migration:**
   ```bash
   npm run migration:run
   ```

5. **Verify:**
   - Check database schema
   - Test your application

## Migration File Structure

Generated migration files look like:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1234567890 implements MigrationInterface {
  name = 'CreateUserTable1234567890'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // SQL to apply the migration
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid PRIMARY KEY,
        "name" varchar NOT NULL,
        ...
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQL to revert the migration
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
```

## Troubleshooting

### Migration fails to generate
- Ensure your database is running
- Check `.env` file has correct database credentials
- Verify entities are properly defined

### Migration conflicts
- Review existing migrations
- Ensure you're working with the latest database state
- Consider reverting and regenerating if needed
