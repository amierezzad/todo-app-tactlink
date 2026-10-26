import { NetworkStatus, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '../components/button'
import { IconButton } from '../components/icon-button'
import { CheckIcon, LogOutIcon, PlusIcon, TrashIcon } from '../components/icons'
import { useAuth } from '../lib/auth'
import { getErrorMessage } from '../lib/errors'
import {
  DELETE_TODO_MUTATION,
  TODOS_QUERY,
  TOGGLE_TODO_MUTATION,
  type Todo,
} from '../lib/graphql'

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Todo
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <li className="group flex items-center rounded-xl border border-grey-200 bg-white p-4">
      {/* 44x44 click target around an 18x18 checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.title}
        onClick={onToggle}
        className="-my-2 -ml-2 flex size-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-black"
      >
        <span
          className={`flex size-[18px] items-center justify-center rounded-[4px] border transition-colors ${
            task.done ? 'border-black bg-black text-white' : 'border-grey-200 bg-white group-hover:border-grey-500'
          }`}
        >
          {task.done ? <CheckIcon /> : null}
        </span>
      </button>

      <span
        className={`ml-1 flex-1 break-words text-[15px] font-medium ${
          task.done ? 'text-grey-500 line-through' : 'text-black'
        }`}
      >
        {task.title}
      </span>

      <IconButton
        onClick={onDelete}
        aria-label={`Delete ${task.title}`}
        className="-my-2 -mr-2 opacity-50 hover:opacity-100 focus-visible:opacity-100"
      >
        <TrashIcon />
      </IconButton>
    </li>
  )
}

export function TasksPage() {
  const { user, signOut } = useAuth()
  const [actionError, setActionError] = useState<string | null>(null)

  const { data, error, networkStatus, refetch } = useQuery<{ todos: Todo[] }>(TODOS_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const [toggleTodo] = useMutation(TOGGLE_TODO_MUTATION)
  const [deleteTodo] = useMutation(DELETE_TODO_MUTATION)

  const tasks = data?.todos ?? []
  const firstLoad = !data && networkStatus === NetworkStatus.loading
  const remaining = tasks.filter((t) => !t.done).length

  const handleToggle = (task: Todo) => {
    setActionError(null)
    toggleTodo({
      variables: { id: task.id },
      // Flip the checkbox immediately; Apollo rolls back if the server fails.
      optimisticResponse: { toggleTodo: { __typename: 'Todo', id: task.id, done: !task.done } },
    }).catch((e) => setActionError(`Couldn't update the task. ${getErrorMessage(e)}`))
  }

  const handleDelete = (task: Todo) => {
    setActionError(null)
    deleteTodo({
      variables: { id: task.id },
      optimisticResponse: { deleteTodo: true },
      update(cache, { data: result }) {
        if (!result?.deleteTodo) return
        cache.evict({ id: cache.identify({ __typename: 'Todo', id: task.id }) })
        cache.gc()
      },
    }).catch((e) => setActionError(`Couldn't delete the task. ${getErrorMessage(e)}`))
  }

  const handleSignOut = () => {
    if (window.confirm('Log out? You will need to log in again to see your tasks.')) {
      void signOut()
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col bg-white">
      <header className="flex items-center justify-between gap-4 px-6 pb-4 pt-8">
        <div className="min-w-0">
          <h1 className="text-[32px] font-bold tracking-tight text-black">My Tasks</h1>
          {data ? (
            <p className="truncate text-[13px] text-grey-500">
              {tasks.length === 0
                ? user?.email
                : `${remaining} of ${tasks.length} left · ${user?.email ?? ''}`}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <IconButton onClick={handleSignOut} aria-label="Log out" title="Log out">
            <LogOutIcon />
          </IconButton>
          <Link
            to="/new"
            aria-label="New task"
            title="New task"
            className="flex size-11 items-center justify-center rounded-xl border border-grey-200 bg-grey-100 text-black transition-colors hover:bg-grey-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <PlusIcon />
          </Link>
        </div>
      </header>

      <section className="flex flex-1 flex-col px-6 pb-10 pt-2">
        {actionError ? (
          <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-black px-4 py-3 text-sm font-medium">
            <span>{actionError}</span>
            <button type="button" onClick={() => setActionError(null)} className="underline">
              Dismiss
            </button>
          </div>
        ) : null}

        {firstLoad ? (
          <div className="flex flex-1 items-center justify-center" aria-label="Loading tasks">
            <span className="size-6 animate-spin rounded-full border-2 border-grey-200 border-t-black" />
          </div>
        ) : error && !data ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="mb-2 text-lg font-semibold">Couldn&apos;t load your tasks</p>
            <p className="mb-6 max-w-sm text-base leading-6 text-grey-500">{getErrorMessage(error)}</p>
            <div className="w-full max-w-xs">
              <Button onClick={() => void refetch().catch(() => {})}>Try again</Button>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-base text-grey-500">No tasks yet. Create one to get started.</p>
          </div>
        ) : (
          <>
            {error ? (
              <div className="mb-4 rounded-xl bg-grey-100 px-4 py-3 text-[13px] font-medium">
                You&apos;re offline. Showing saved tasks.
              </div>
            ) : null}
            <ul className="space-y-4">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggle(task)}
                  onDelete={() => handleDelete(task)}
                />
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}
