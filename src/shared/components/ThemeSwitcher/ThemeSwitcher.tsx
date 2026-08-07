import React from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/lib/shadcn/components/ui/dropdown-menu';
import { Button } from '@/lib/shadcn/components/ui/button';
import { useTheme } from '@/core/theme';
import type { Mode, PresetName } from '@/core/theme';

const presetLabels: Record<PresetName, string> = {
  modern: 'Modern',
  classic: 'Classic',
  metro: 'Metro',
  brand: 'Brand',
};

const modeIcons: Record<Mode, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const modes: Mode[] = ['light', 'dark', 'system'];

export const ThemeSwitcher: React.FC = () => {
  const { preset, setPreset, presets, mode, setMode } = useTheme();
  const ModeIcon = modeIcons[mode];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{presetLabels[preset]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {presets.map(name => (
            <DropdownMenuItem
              key={name}
              onClick={() => setPreset(name)}
              className={`cursor-pointer ${preset === name ? 'bg-accent' : ''}`}
            >
              {presetLabels[name]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ModeIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {modes.map(m => {
            const Icon = modeIcons[m];
            return (
              <DropdownMenuItem
                key={m}
                onClick={() => setMode(m)}
                className={`cursor-pointer gap-2 ${mode === m ? 'bg-accent' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
