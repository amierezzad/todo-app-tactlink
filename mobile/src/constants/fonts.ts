// Font files loaded at startup. The keys are the family names used in
// tailwind.config.js (font-metropolis, font-metropolis-medium, ...).
export const fontAssets = {
  'Metropolis-Regular': require('../../assets/fonts/metropolis/Metropolis-Regular.otf'),
  'Metropolis-Medium': require('../../assets/fonts/metropolis/Metropolis-Medium.otf'),
  'Metropolis-SemiBold': require('../../assets/fonts/metropolis/Metropolis-SemiBold.otf'),
  'Metropolis-Bold': require('../../assets/fonts/metropolis/Metropolis-Bold.otf'),
};

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';
