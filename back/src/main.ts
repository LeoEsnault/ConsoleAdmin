import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins: string[] = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map(url => url.trim())
    : [];

  app.enableCors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error("Error during app bootstrap:", error);
  process.exit(1);
});
