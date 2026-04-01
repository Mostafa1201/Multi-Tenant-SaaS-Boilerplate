import winston, { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;
export abstract class Logger {
  protected logger: winston.Logger;

  constructor() {
    const logFormat = printf(({ level, message, timestamp, trace, app }) => {
      return `${timestamp} [${level}] [app: ${app}]: ${message} ${trace ? `Trace: ${trace}` : ''}`;
    });

    this.logger = createLogger({
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.simple()
        })
      );
    }
  }

  info(message: string, trace?: string, app?: string) {
    this.logger.info({ message, trace, app });
  }

  error(message: string, trace?: string, app?: string) {
    this.logger.error({ message, trace, app });
  }

  warn(message: string, trace?: string, app?: string) {
    this.logger.warn({ message, trace, app });
  }

  debug(message: string, trace?: string, app?: string) {
    this.logger.debug({ message, trace, app });
  }
}
