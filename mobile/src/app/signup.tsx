import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { type TextInputInstance, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { AuthForm } from '@/components/auth-form';
import { FormError } from '@/components/form-error';
import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { useAuth } from '@/lib/auth';
import { getErrorMessage } from '@/lib/errors';
import { MIN_PASSWORD_LENGTH, validateEmail } from '@/lib/validation';

type Errors = { email?: string; password?: string; confirm?: string; form?: string };

export default function SignupScreen() {
  const { signUp } = useAuth();
  const passwordRef = useRef<TextInputInstance>(null);
  const confirmRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const clear = (key: keyof Errors) =>
    errors[key] ? setErrors((e) => ({ ...e, [key]: undefined })) : undefined;

  const handleSignup = async () => {
    const next: Errors = {
      email: validateEmail(email),
      password:
        password.length < MIN_PASSWORD_LENGTH
          ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
          : undefined,
      confirm: confirm !== password ? 'Passwords do not match.' : undefined,
    };
    setErrors(next);
    if (next.email || next.password || next.confirm) return;

    setSubmitting(true);
    try {
      await signUp(email, password);
    } catch (e) {
      setErrors({ form: getErrorMessage(e) });
      setSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Sign up"
      subtitle="Create an account to start keeping track of your tasks."
      footer={
        <>
          <PrimaryButton label="Create account" onPress={handleSignup} loading={submitting} />
          <View className="mt-5 flex-row justify-center">
            <AppText className="text-sm text-grey-500">Have an account? </AppText>
            <Link href="/login" replace accessibilityRole="link">
              <AppText weight="semibold" className="text-sm text-black underline">
                Log in
              </AppText>
            </Link>
          </View>
        </>
      }
    >
      <TextField
        label="Email address"
        placeholder="name@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          clear('email');
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef}
        label="Password"
        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          clear('password');
        }}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmRef.current?.focus()}
      />
      <TextField
        ref={confirmRef}
        label="Confirm password"
        placeholder="••••••••"
        value={confirm}
        onChangeText={(v) => {
          setConfirm(v);
          clear('confirm');
        }}
        error={errors.confirm}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSignup}
      />

      <FormError message={errors.form} />
    </AuthForm>
  );
}
