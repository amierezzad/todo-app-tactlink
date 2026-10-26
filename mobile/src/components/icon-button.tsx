import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

type IconButtonProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  className?: string;
  disabled?: boolean;
};

// 44x44 square tap target, as in the mockup.
export function IconButton({
  children,
  onPress,
  accessibilityLabel,
  className = '',
  disabled,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={4}
      className={`h-11 w-11 items-center justify-center rounded-xl active:bg-grey-100 ${className}`}
    >
      {children}
    </Pressable>
  );
}
