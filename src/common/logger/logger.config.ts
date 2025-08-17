import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import { WinstonModuleOptions } from 'nest-winston'
import * as winston from 'winston'

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // Console log
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        nestWinstonModuleUtilities.format.nestLike('App', { prettyPrint: true })
      )
    }),

    // Error logs -> file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json())
    }),

    // All logs -> file
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json())
    })
  ]
}
