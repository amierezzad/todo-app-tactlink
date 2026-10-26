import { forwardRef, useState } from 'react';
import { TextInput, type TextInputInstance, type TextInputProps, View } from 'react-native';

import { AppText } from '@/components/app-text';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
};

// Labelled input from the mockup: grey label, 52px field, black border on focus.
export const TextField = forwardRef<TextInputInstance, TextFieldProps>(function TextField(
  { label, error, onFocus, onBlur, ...inputProps },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const borderClass = focused || error ? 'border-black' : 'border-grey-200';

  return (
    <View className="mb-5 w-full">
      <AppText weight="medium" className="mb-2 text-[13px] text-grey-500">
        {label}
      </AppText>
      <TextInput
        ref={ref}
        placeholderTextColor="#8A8A8A"
        className={`h-[52px] w-full rounded-xl border bg-white px-4 font-metropolis text-base text-black ${borderClass}`}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...inputProps}
      />
      {error ? (
        <AppText weight="medium" className="mt-2 text-[13px] text-black" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
    </View>
  );
});
