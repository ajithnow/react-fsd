export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

export interface LogData {
  message: string;
  level: LogLevel;
  timestamp: string;
  context?: string;
  data?: unknown;
}
