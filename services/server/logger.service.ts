import SpwLoggerService from '@cx/spw-logger';

export class LoggerService {
  spwLogger: SpwLoggerService = new SpwLoggerService({ isSuppressed: true, substringLength: 2000 });

  constructor(senderString?: string) {
    if (senderString) {
      this.spwLogger.setSender(senderString);
    }
  }

  info(message: any, ...options: any[]) {
    if (options.length > 0) this.spwLogger.info(message, options);
    else this.spwLogger.info(message);
  }

  error(message: any, ...options: any[]) {
    if (options.length > 0) this.spwLogger.error(message, options);
    else this.spwLogger.error(message);
  }

  downstream(message: any) {
    this.spwLogger.downstream(message);
  }
}
