import { View } from 'react-native';

import { AppText } from '@/components/app-text';

// Outlined black box for form-level errors (no red, per the design).
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <View className="rounded-xl border border-black px-4 py-3">
      <AppText weight="medium" className="text-sm leading-5 text-black" accessibilityRole="alert">
        {message}
      </AppText>
    </View>
  );
}
