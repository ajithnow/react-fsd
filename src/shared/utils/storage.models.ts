export const StorageType = {
  LOCAL: 'local',
  SESSION: 'session',
} as const;

export type StorageType = typeof StorageType[keyof typeof StorageType];
