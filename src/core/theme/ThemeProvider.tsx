import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { storageService } from '@/shared/utils/storage.service';
import type { Mode, PresetName, ResolvedMode } from './tokens.types';
import { presetNames } from './presets';
import { applyPresetTokens, resolveMode } from './apply-preset';
import { MODE_STORAGE_KEY, PRESET_STORAGE_KEY } from './storage-keys';

interface ThemeContextValue {
  preset: PresetName;
  setPreset: (preset: PresetName) => void;
  presets: PresetName[];
  mode: Mode;
  setMode: (mode: Mode) => void;
  resolvedMode: ResolvedMode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPresetState] = useState<PresetName>(
    () => storageService.getItem<PresetName>(PRESET_STORAGE_KEY) ?? 'modern'
  );
  const [mode, setModeState] = useState<Mode>(
    () => storageService.getItem<Mode>(MODE_STORAGE_KEY) ?? 'system'
  );
  const [resolvedMode, setResolvedMode] = useState<ResolvedMode>(() => resolveMode(mode));

  const setPreset = useCallback((next: PresetName) => {
    setPresetState(next);
    storageService.setItem(PRESET_STORAGE_KEY, next);
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    storageService.setItem(MODE_STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    setResolvedMode(resolveMode(mode));

    if (mode !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => setResolvedMode(resolveMode('system'));
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [mode]);

  useEffect(() => {
    applyPresetTokens(preset, resolvedMode);
  }, [preset, resolvedMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ preset, setPreset, presets: presetNames, mode, setMode, resolvedMode }),
    [preset, setPreset, mode, setMode, resolvedMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
