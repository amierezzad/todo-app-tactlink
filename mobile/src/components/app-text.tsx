import { Text, type TextProps } from 'react-native';

import type { FontWeight } from '@/constants/fonts';

const weightClass: Record<FontWeight, string> = {
  regular: 'font-metropolis',
  medium: 'font-metropolis-medium',
  semibold: 'font-metropolis-semibold',
  bold: 'font-metropolis-bold',
};

type AppTextProps = TextProps & {
  className?: string;
  weight?: FontWeight;
};

// Text that always uses Metropolis. Pick the weight with `weight`,
// because each weight is a separate font file.
export function AppText({ weight = 'regular', className = '', ...props }: AppTextProps) {
  return <Text {...props} className={`${weightClass[weight]} ${className}`} />;
}
