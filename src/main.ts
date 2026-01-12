import { ValidationPipe, BadRequestException } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationError } from "class-validator";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix("api/v1");

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle("Lingora API")
    .setDescription("Lingora API documentation with Swagger/OpenAPI")
    .setVersion("1.0")
    .addTag("users", "User management endpoints")
    .addTag("auth", "Authentication endpoints")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Global exception filter to format all errors as arrays
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: false,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        // Preserve ValidationError structure for field-level error formatting
        return new BadRequestException(errors);
      },
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger documentation: http://localhost:3000/api/docs`);
}
void bootstrap();
