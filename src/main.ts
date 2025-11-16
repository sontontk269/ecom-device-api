import { NestFactory } from '@nestjs/core'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(cookieParser())

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  //Swagger config
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API for e-commerce')
    .setVersion('1.0')
    .addTag('api')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // Cấu hình CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })

  await app.listen(process.env.PORT ?? 3003)
}
bootstrap()
