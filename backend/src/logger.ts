import { createLogger, format, transports } from 'winston'

const isTestEnv = process.env.NODE_ENV === 'test'

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.splat(), format.simple()),
  transports: isTestEnv ? [new transports.Console({ silent: true })] : [new transports.Console()]
})
