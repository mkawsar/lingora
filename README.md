# Lingora

A NestJS application with PostgreSQL database, TypeORM, and UUID-based primary keys.

## 🚀 Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## 📋 Prerequisites

- Node.js (LTS version - v20 or higher recommended)
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

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

Or create it manually with:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=lingora

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=development
```

4. Generate and automatically update JWT secret:
```bash
npm run generate:jwt-secret
```

This command will:
- Generate a cryptographically secure random 512-bit secret
- **Automatically update** the `JWT_SECRET` in your `.env` file
- Create `.env` file if it doesn't exist
- Add `JWT_EXPIRES_IN=7d` if not present

**Note:** The script will update existing `JWT_SECRET` or add it if missing.

**Alternative methods to generate JWT_SECRET (manual):**
```bash
# Using Node.js (one-liner) - requires manual copy to .env
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL - requires manual copy to .env
openssl rand -hex 64
```

5. Create the PostgreSQL database:
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

### JWT Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- **Token Generation**: Login endpoint returns JWT access token
- **Token Expiration**: Configurable via `JWT_EXPIRES_IN` (default: 7 days)
- **Protected Routes**: Use `@UseGuards(JwtAuthGuard)` to protect endpoints
- **Token Format**: Bearer token in `Authorization` header
- **Token Payload**: Includes user ID, email, isGuest, and isAdmin flags

## 📝 API Endpoints

All API endpoints are prefixed with `api/v1`.

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/register/guest` - Register a guest user
- `POST /api/v1/auth/login` - Login and get JWT token

### Users

- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by UUID
- `PATCH /api/v1/users/:id` - Update user by UUID
- `DELETE /api/v1/users/:id` - Delete user by UUID
- `GET /api/v1/users/profile/me` - Get current user profile (requires JWT token)

### Authentication Flow

1. **Register or Login** to get a JWT token:
   ```bash
   POST /api/v1/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Use the token** in protected endpoints:
   ```bash
   GET /api/v1/users/profile/me
   Authorization: Bearer <your-jwt-token>
   ```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔄 CI/CD

This project includes GitHub Actions workflows for continuous integration:

### Automated Checks

On every push and pull request, the CI workflow will:

1. **Setup Environment** - Copy `.env.example` to `.env` and generate JWT secret
   - Copies environment variables from `.env.example`
   - Generates secure JWT_SECRET automatically
   - Creates `.env` file if `.env.example` doesn't exist

2. **Code Formatting Check** - Verify all code follows Prettier formatting rules
   - Command: `npm run format:check`
   - Fails if code is not properly formatted
   - Similar to Pint (PHP formatter)

3. **Linter Check** - Run ESLint to ensure code quality and detect issues
   - Command: `npm run lint:check`
   - Detects unused variables and imports
   - Similar to PHPStan (PHP static analyzer)
   - Does not auto-fix (for CI validation)

4. **Type Check** - Validate TypeScript types
   - Command: `npm run type-check`
   - Catches type errors before tests run

5. **Database Migrations** - Run database migrations
   - Command: `npm run migration:run`
   - Sets up database schema before tests

6. **Unit Tests** - Run all unit tests with Jest
   - Command: `npm run test`

7. **Test Coverage** - Generate and report test coverage
   - Command: `npm run test:cov`

8. **Build** - Verify the application builds successfully
   - Command: `npm run build`

9. **E2E Tests** - Run end-to-end tests against a test database
   - Command: `npm run test:e2e`

The workflow file is located at `.github/workflows/ci.yml`

### Running Checks Locally

Before pushing, ensure all checks pass:

```bash
# Check code formatting (like Pint)
npm run format:check

# Auto-fix formatting issues
npm run format

# Check for unused variables and imports (like PHPStan)
npm run lint:check

# Auto-fix linting issues
npm run lint

# Check TypeScript types
npm run type-check

# Run tests
npm run test

# Run with coverage
npm run test:cov

# Run E2E tests (requires database)
npm run test:e2e
```

### Pre-commit Checklist

Before committing code, run:

```bash
# 1. Format code
npm run format

# 2. Fix linting issues (including unused variables)
npm run lint

# 3. Verify types
npm run type-check

# 4. Run tests
npm run test

# 5. Build to ensure everything compiles
npm run build
```

### CI/CD Failure Prevention

The CI workflow will fail if:
- ❌ Code is not properly formatted
- ❌ Unused variables or imports are detected
- ❌ TypeScript type errors exist
- ❌ Tests fail
- ❌ Build fails

**Tip**: Run `npm run format && npm run lint && npm run type-check && npm run test && npm run build` locally before pushing to avoid CI failures.

## 📦 Available Scripts

### Development
- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode (watch mode)
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode

### Code Quality
- `npm run format` - Format code with Prettier (auto-fix)
- `npm run format:check` - Check code formatting (CI-friendly, no auto-fix)
- `npm run lint` - Run ESLint and auto-fix issues
- `npm run lint:check` - Check for linting issues including unused variables/imports (CI-friendly, no auto-fix)
- `npm run type-check` - Check TypeScript types without building

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests

### Database Migrations
- `npm run migration:generate` - Generate a new migration
- `npm run migration:create` - Create an empty migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration

### Utilities
- `npm run generate:jwt-secret` - Generate and automatically update JWT_SECRET in .env file

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
