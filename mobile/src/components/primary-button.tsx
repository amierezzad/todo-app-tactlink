import { ActivityIndicator, Pressable } from 'react-native';

import { AppText } from '@/components/app-text';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

// Full-width black button from the mockup (52px tall, 12px radius).
export function PrimaryButton({ label, onPress, loading, disabled }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      className={`h-[52px] w-full flex-row items-center justify-center rounded-xl bg-black px-4 active:opacity-80 ${
        disabled && !loading ? 'opacity-40' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <AppText weight="medium" className="text-base text-white">
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
