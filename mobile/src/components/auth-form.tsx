import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';

// Shared layout for the login and sign-up screens (from the mockup):
// big title, grey subtitle, fields, and the button pinned to the bottom.
export function AuthForm({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 pb-6 pt-12"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            <AppText weight="bold" className="mb-2 text-[32px] tracking-[-0.8px] text-black">
              {title}
            </AppText>
            <AppText className="mb-10 text-base leading-6 text-grey-500">{subtitle}</AppText>
            {children}
          </View>
          <View className="pt-4">{footer}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
