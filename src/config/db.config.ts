import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs(
  "database",
  (): TypeOrmModuleOptions => ({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "lingora",
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: false, // Disabled - use migrations instead
    migrations: [__dirname + "/../database/migration/**/*{.ts,.js}"],
    migrationsRun: false, // Set to true if you want migrations to run automatically on app start
    logging: process.env.NODE_ENV === "development",
  }),
);
