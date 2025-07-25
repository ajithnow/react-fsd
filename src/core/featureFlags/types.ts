export interface FeatureFlags {
  newUI: boolean;
  analytics: boolean;
  darkMode: boolean;
  experiments: {
    buttonColor: string;
    layout: string;
  };
}

export type FeaturePath = 
  | 'newUI'
  | 'analytics'
  | 'darkMode'
  | 'experiments.buttonColor'
  | 'experiments.layout';

export type FeatureValue<T extends FeaturePath> = 
  T extends 'newUI' | 'analytics' | 'darkMode' ? boolean :
  T extends 'experiments.buttonColor' | 'experiments.layout' ? string :
  unknown;
