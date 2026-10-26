import { useMutation } from '@apollo/client';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { FormError } from '@/components/form-error';
import { IconButton } from '@/components/icon-button';
import { ChevronLeftIcon } from '@/components/icons';
import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { getErrorMessage } from '@/lib/errors';
import { ADD_TODO_MUTATION, TODO_FIELDS, type Todo } from '@/lib/graphql';

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [addTodo, { loading }] = useMutation<{ addTodo: Todo }>(ADD_TODO_MUTATION, {
    // Append the new task to the cached list so My Tasks updates instantly.
    update(cache, { data }) {
      if (!data) return;
      cache.modify({
        fields: {
          todos(existing = []) {
            const ref = cache.writeFragment({ data: data.addTodo, fragment: TODO_FIELDS });
            return [...existing, ref];
          },
        },
      });
    },
  });

  const canSave = title.trim().length > 0;

  const handleSave = async () => {
    if (!canSave || loading) return;
    setError(null);
    try {
      await addTodo({ variables: { title: title.trim() } });
      router.back();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center px-4 pb-2 pt-6">
          <IconButton onPress={() => router.back()} accessibilityLabel="Back" className="mr-2">
            <ChevronLeftIcon />
          </IconButton>
          <AppText weight="semibold" className="text-xl text-black">
            New Task
          </AppText>
        </View>

        <View className="flex-1 px-6 pt-6">
          <TextField
            label="Task description"
            placeholder="What needs to be done?"
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              if (error) setError(null);
            }}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
            maxLength={200}
          />
          <FormError message={error} />
          <View className="flex-1" />
          <View className="pb-6">
            <PrimaryButton
              label="Save task"
              onPress={handleSave}
              loading={loading}
              disabled={!canSave}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
