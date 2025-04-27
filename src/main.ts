import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { json } from "express";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule, SwaggerDocumentOptions } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true, // اینجا اشتباه تایپی داشتی: credential ❌ -> credentials ✅
  });

  app.use(helmet());
  app.use(json({ limit: "10mb" }));
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Ai Assistant")
    .setDescription("Ai Assistant API description")
    .addBearerAuth(
      {
        name: "Authorization",
        description: "Please enter token in following format: Bearer <JWT>",
        scheme: "Bearer",
        type: "http",
        in: "Header",
        bearerFormat: "Bearer",
      },
      "access-token"
    )
    .setVersion("0.1")
    .addServer("/")
    .addServer("")
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions);
  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get("App.port");
  await app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log(`Swagger is running at http://localhost:${port}/swagger`);
  });
}
bootstrap();
