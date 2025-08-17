import { Controller, Get, GoneException } from '@nestjs/common'

@Controller('test')
export class AppController {
  constructor() {}

  @Get()
  testApi() {
    // throw new GoneException()
    return 'user'
  }
}
