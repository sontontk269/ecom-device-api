import { NestFactory } from '@nestjs/core'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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
    origin: 'http://localhost:3000'
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
