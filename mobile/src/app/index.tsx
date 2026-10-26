import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { IconButton } from '@/components/icon-button';
import { CheckIcon, LogOutIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { PrimaryButton } from '@/components/primary-button';
import { useAuth } from '@/lib/auth';
import { getErrorMessage } from '@/lib/errors';
import {
  DELETE_TODO_MUTATION,
  TODOS_QUERY,
  TOGGLE_TODO_MUTATION,
  type Todo,
} from '@/lib/graphql';

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Todo;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <View className="flex-row items-center rounded-xl border border-grey-200 bg-white p-4">
      {/* 44x44 tap target around an 18x18 checkbox */}
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={task.title}
        className="-my-2 -ml-2 h-11 w-11 items-center justify-center"
      >
        <View
          className={`h-[18px] w-[18px] items-center justify-center rounded-[4px] border ${
            task.done ? 'border-black bg-black' : 'border-grey-200 bg-white'
          }`}
        >
          {task.done ? <CheckIcon /> : null}
        </View>
      </Pressable>

      <AppText
        weight="medium"
        className={`ml-1 flex-1 text-[15px] ${task.done ? 'text-grey-500 line-through' : 'text-black'}`}
      >
        {task.title}
      </AppText>

      <IconButton
        onPress={onDelete}
        accessibilityLabel={`Delete ${task.title}`}
        className="-my-2 -mr-2 opacity-50"
      >
        <TrashIcon />
      </IconButton>
    </View>
  );
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return <View className="flex-1 items-center justify-center px-6">{children}</View>;
}

export default function TaskListScreen() {
  const { signOut } = useAuth();

  // cache-and-network: show saved tasks instantly (also offline), then refresh.
  const { data, error, networkStatus, refetch } = useQuery<{ todos: Todo[] }>(TODOS_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [toggleTodo] = useMutation(TOGGLE_TODO_MUTATION);
  const [deleteTodo] = useMutation(DELETE_TODO_MUTATION);

  const tasks = data?.todos ?? [];
  const refreshing = networkStatus === NetworkStatus.refetch;
  const firstLoad = !data && networkStatus === NetworkStatus.loading;

  const handleToggle = (task: Todo) => {
    toggleTodo({
      variables: { id: task.id },
      // Flip the checkbox immediately; Apollo rolls back if the server fails.
      optimisticResponse: { toggleTodo: { __typename: 'Todo', id: task.id, done: !task.done } },
    }).catch((e) => Alert.alert("Couldn't update task", getErrorMessage(e)));
  };

  const handleDelete = (task: Todo) => {
    deleteTodo({
      variables: { id: task.id },
      optimisticResponse: { deleteTodo: true },
      update(cache, { data: result }) {
        if (!result?.deleteTodo) return;
        cache.evict({ id: cache.identify({ __typename: 'Todo', id: task.id }) });
        cache.gc();
      },
    }).catch((e) => Alert.alert("Couldn't delete task", getErrorMessage(e)));
  };

  const confirmSignOut = () => {
    Alert.alert('Log out?', 'You will need to log in again to see your tasks.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  let body: React.ReactNode;
  if (firstLoad) {
    body = (
      <CenteredMessage>
        <ActivityIndicator color="#000000" />
      </CenteredMessage>
    );
  } else if (error && !data) {
    body = (
      <CenteredMessage>
        <AppText weight="semibold" className="mb-2 text-center text-lg text-black">
          Couldn&apos;t load your tasks
        </AppText>
        <AppText className="mb-6 text-center text-base leading-6 text-grey-500">
          {getErrorMessage(error)}
        </AppText>
        <View className="w-full">
          <PrimaryButton
            label="Try again"
            onPress={() => {
              refetch().catch(() => {});
            }}
          />
        </View>
      </CenteredMessage>
    );
  } else {
    body = (
      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TaskRow
            task={item}
            onToggle={() => handleToggle(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerClassName="flex-grow px-6 pb-10 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              refetch().catch(() => {});
            }}
            tintColor="#000000"
          />
        }
        ListHeaderComponent={
          error ? (
            // We still have saved tasks, but the latest fetch failed.
            <View className="mb-4 rounded-xl bg-grey-100 px-4 py-3">
              <AppText weight="medium" className="text-[13px] text-black">
                You&apos;re offline. Showing saved tasks.
              </AppText>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          <CenteredMessage>
            <AppText className="text-center text-base text-grey-500">
              No tasks yet. Create one to get started.
            </AppText>
          </CenteredMessage>
        }
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 pb-4 pt-8">
        <AppText weight="bold" className="text-[32px] tracking-[-0.8px] text-black">
          My Tasks
        </AppText>
        <View className="flex-row items-center">
          <IconButton onPress={confirmSignOut} accessibilityLabel="Log out" className="mr-2">
            <LogOutIcon />
          </IconButton>
          <IconButton
            onPress={() => router.push('/new-task')}
            accessibilityLabel="New task"
            className="border border-grey-200 bg-grey-100"
          >
            <PlusIcon />
          </IconButton>
        </View>
      </View>
      {body}
    </SafeAreaView>
  );
}
