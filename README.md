# Lingora

A NestJS application with PostgreSQL database, TypeORM, and UUID-based primary keys.

## 🚀 Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## 📋 Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lingora
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=lingora

# Application
NODE_ENV=development
```

4. Create the PostgreSQL database:
```sql
CREATE DATABASE lingora;
```

## 🗄️ Database Setup

This project uses **TypeORM migrations** for database schema management. Auto-sync is **disabled** to ensure controlled and versioned database changes.

### Generate Migration

After creating or modifying entities, generate a migration:

```bash
npm run migration:generate -- src/database/migration/CreateUserTable
```

This command:
- Compares your entities with the current database state
- Generates a migration file in `src/database/migration/`
- Includes all SQL needed to create/update tables

### Run Migrations

Apply migrations to your database:

```bash
npm run migration:run
```

### Revert Migration

To undo the last migration:

```bash
npm run migration:revert
```

### Create Empty Migration

To create a manual migration file:

```bash
npm run migration:create -- src/database/migration/MigrationName
```

> **Note**: See [MIGRATIONS.md](./MIGRATIONS.md) for detailed migration documentation.

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

### API Documentation (Swagger)

Once the application is running, you can access the Swagger UI at:

```
http://localhost:3000/api/docs
```

The Swagger documentation provides:
- Interactive API explorer
- Request/response schemas
- Try-it-out functionality
- API endpoint descriptions

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## 📁 Project Structure

```
lingora/
├── src/
│   ├── config/              # Configuration files
│   │   ├── app.config.ts
│   │   ├── db.config.ts
│   │   └── jwt.config.ts
│   ├── database/            # Database configuration
│   │   ├── database.module.ts
│   │   └── migration/        # Migration files
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   └── users/           # Users module
│   │       ├── entities/    # TypeORM entities
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── users.module.ts
│   ├── common/              # Shared utilities
│   ├── data-source.ts       # TypeORM CLI configuration
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── test/                    # E2E tests
├── .env                     # Environment variables (not in git)
└── package.json
```

## 🔑 Key Features

### UUID Primary Keys

All entities use UUID (Universally Unique Identifier) as primary keys instead of auto-incrementing integers:

- **Format**: `550e8400-e29b-41d4-a716-446655440000`
- **Type**: `string` (not `number`)
- **Auto-generated**: TypeORM automatically generates UUIDs on entity creation

### Database Configuration

- **Auto-sync**: Disabled (`synchronize: false`)
- **Migrations**: Required for all schema changes
- **Entities**: Automatically discovered via glob pattern

### Validation

Global validation pipe is enabled with:
- `whitelist: true` - Strips non-whitelisted properties
- `forbidNonWhitelisted: true` - Throws error for unknown properties
- `transform: true` - Automatically transforms payloads to DTO instances

## 📝 API Endpoints

All API endpoints are prefixed with `api/v1`.

### Users

- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by UUID
- `PATCH /api/v1/users/:id` - Update user by UUID
- `DELETE /api/v1/users/:id` - Delete user by UUID

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode (watch mode)
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run migration:generate` - Generate a new migration
- `npm run migration:create` - Create an empty migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration

## 🔧 Configuration

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
// Instead of:
import { User } from '../../modules/users/entities/user.entity';

// You can use:
import { User } from '@/modules/users/entities/user.entity';
```

### TypeScript Configuration

Path aliases are configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 📚 Additional Documentation

- [MIGRATIONS.md](./MIGRATIONS.md) - Detailed migration guide

## ⚠️ Important Notes

- **Never enable `synchronize: true` in production!**
- Always use migrations for database schema changes
- UUIDs are strings, not numbers
- Review generated migrations before running them

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Generate migrations if you modified entities
4. Run tests
5. Submit a pull request

## 📄 License

UNLICENSED
