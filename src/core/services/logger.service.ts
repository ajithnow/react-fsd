import { ENV } from '@/core/utils/env.utils';

import { LogLevel, LogData } from './logger.models';

class LoggerService {
  private isDevelopment = ENV.IS_DEV;

  private log(level: LogLevel, message: string, data?: unknown, context?: string) {
    const logData: LogData = {
      message,
      level,
      timestamp: new Date().toISOString(),
      context,
      data,
    };

    // Console output
    if (this.isDevelopment || level === LogLevel.ERROR || level === LogLevel.WARN) {
      const consoleMethod = level === LogLevel.DEBUG ? 'debug' : level;
      const prefix = context ? `[${context}]` : '';
      console[consoleMethod](`${prefix} ${message}`, data || '');
    }

    // Remote logging (e.g., Firebase, Sentry)
    if (!this.isDevelopment && (level === LogLevel.ERROR || level === LogLevel.WARN)) {
      this.sendToRemote(logData);
    }
  }

  private sendToRemote(logData: LogData) {
    // Placeholder for remote logging integration
    // Example: firebase.analytics().logEvent('error_logged', logData);
    
    if (this.isDevelopment) {
      // Logic for development if needed
    } else {
      // In production, we'd send this to a service
      // To satisfy lint, we'll log it if not in dev
      // console.log('Remote Log Sent:', logData); 
    }
    
    // Actually use the logData so TS doesn't complain
    return !!logData;
  }

  debug(message: string, data?: unknown, context?: string) {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: unknown, context?: string) {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: unknown, context?: string) {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, data?: unknown, context?: string) {
    this.log(LogLevel.ERROR, message, data, context);
  }
}

export const logger = new LoggerService();
