import type { PresetName, PresetVariant } from '../tokens.types';
import { modernTokens } from './modern.tokens';
import { classicTokens } from './classic.tokens';
import { metroTokens } from './metro.tokens';
import { brandTokens } from './brand.tokens';

export const presets: Record<PresetName, PresetVariant> = {
  modern: modernTokens,
  classic: classicTokens,
  metro: metroTokens,
  brand: brandTokens,
};

export const presetNames: PresetName[] = ['modern', 'classic', 'metro', 'brand'];
