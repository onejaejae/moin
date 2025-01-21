import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setNestApp } from 'setNestApp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setNestApp(app);

  await app.listen(4000);
}
bootstrap();
