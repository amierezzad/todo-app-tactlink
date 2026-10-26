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
import { validateEmail } from '@/lib/validation';

type Errors = { email?: string; password?: string; form?: string };

export default function LoginScreen() {
  const { signIn, notice } = useAuth();
  const passwordRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const next: Errors = {
      email: validateEmail(email),
      password: password ? undefined : 'Enter your password.',
    };
    setErrors(next);
    if (next.email || next.password) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
      // Stack.Protected switches to the task list automatically.
    } catch (e) {
      setErrors({ form: getErrorMessage(e) });
      setSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Log in"
      subtitle="Welcome back. Enter your details to access your tasks."
      footer={
        <>
          <PrimaryButton label="Log in" onPress={handleLogin} loading={submitting} />
          <View className="mt-5 flex-row justify-center">
            <AppText className="text-sm text-grey-500">No account? </AppText>
            <Link href="/signup" replace accessibilityRole="link">
              <AppText weight="semibold" className="text-sm text-black underline">
                Sign up
              </AppText>
            </Link>
          </View>
        </>
      }
    >
      {notice && !errors.form ? (
        <View className="mb-5">
          <FormError message={notice} />
        </View>
      ) : null}

      <TextField
        label="Email address"
        placeholder="name@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
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
        placeholder="••••••••"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleLogin}
      />

      <FormError message={errors.form} />
    </AuthForm>
  );
}
