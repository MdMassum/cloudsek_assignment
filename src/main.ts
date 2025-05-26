import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './config/swagger.config';
import { setupSocket } from './config/socket.config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform:true }));
  app.use(cookieParser());
  setupSwagger(app);
  app.enableCors();
  const server = setupSocket(app);  // socket server
  await app.init();
  const PORT = process.env.PORT
  server.listen(PORT || 3000,()=>{
    console.log(`Server running on http://localhost:${PORT || 3000}`);
  });
}
bootstrap();
