import type { Mode, PresetName, ResolvedMode, ThemeTokens } from './tokens.types';
import { presets } from './presets';

const STYLE_TAG_ID = 'theme-tokens';

export const resolveMode = (mode: Mode): ResolvedMode => {
  if (mode === 'system') {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
};

export const tokensToCssVars = (tokens: ThemeTokens): string => {
  const c = tokens.colors;
  const vars: Record<string, string> = {
    '--background': c.background,
    '--foreground': c.foreground,
    '--card': c.card,
    '--card-foreground': c.cardForeground,
    '--popover': c.popover,
    '--popover-foreground': c.popoverForeground,
    '--primary': c.primary,
    '--primary-foreground': c.primaryForeground,
    '--secondary': c.secondary,
    '--secondary-foreground': c.secondaryForeground,
    '--muted': c.muted,
    '--muted-foreground': c.mutedForeground,
    '--accent': c.accent,
    '--accent-foreground': c.accentForeground,
    '--destructive': c.destructive,
    '--destructive-foreground': c.destructiveForeground,
    '--border': c.border,
    '--input': c.input,
    '--ring': c.ring,
    '--chart-1': c.chart1,
    '--chart-2': c.chart2,
    '--chart-3': c.chart3,
    '--chart-4': c.chart4,
    '--chart-5': c.chart5,
    '--sidebar': c.sidebar,
    '--sidebar-foreground': c.sidebarForeground,
    '--sidebar-primary': c.sidebarPrimary,
    '--sidebar-primary-foreground': c.sidebarPrimaryForeground,
    '--sidebar-accent': c.sidebarAccent,
    '--sidebar-accent-foreground': c.sidebarAccentForeground,
    '--sidebar-border': c.sidebarBorder,
    '--sidebar-ring': c.sidebarRing,
    '--radius': tokens.radius,
    '--font-sans': tokens.fontSans,
    '--font-mono': tokens.fontMono,
    '--shadow-sm': tokens.shadows.sm,
    '--shadow-md': tokens.shadows.md,
    '--shadow-lg': tokens.shadows.lg,
    '--shadow-xl': tokens.shadows.xl,
  };

  const declarations = Object.entries(vars)
    .map(([name, value]) => `${name}:${value};`)
    .join('');

  return `:root{${declarations}}`;
};

export const applyPresetTokens = (preset: PresetName, resolvedMode: ResolvedMode): void => {
  const tokens = presets[preset][resolvedMode];

  let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = STYLE_TAG_ID;
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = tokensToCssVars(tokens);

  document.documentElement.dataset.theme = preset;
  document.documentElement.classList.toggle('dark', resolvedMode === 'dark');
};
