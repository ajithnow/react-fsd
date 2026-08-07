export interface ThemeColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface ThemeShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTokens {
  colors: ThemeColorTokens;
  radius: string;
  fontSans: string;
  fontMono: string;
  shadows: ThemeShadowTokens;
}

export interface PresetVariant {
  light: ThemeTokens;
  dark: ThemeTokens;
}

export type PresetName = 'modern' | 'classic' | 'metro' | 'brand';

export type Mode = 'light' | 'dark' | 'system';

export type ResolvedMode = 'light' | 'dark';
