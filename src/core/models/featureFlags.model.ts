export interface FeatureFlags {
  [key: string]: boolean | string | number | Record<string, unknown>;
}

export type FeatureValue = boolean | string | number;
