import { useMutation } from '@apollo/client'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '../components/button'
import { FormError } from '../components/form-error'
import { IconButton } from '../components/icon-button'
import { ChevronLeftIcon } from '../components/icons'
import { TextField } from '../components/text-field'
import { getErrorMessage } from '../lib/errors'
import { ADD_TODO_MUTATION, TODO_FIELDS, type Todo } from '../lib/graphql'

export function NewTaskPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [addTodo, { loading }] = useMutation<{ addTodo: Todo }>(ADD_TODO_MUTATION, {
    // Append the new task to the cached list so My Tasks updates instantly.
    update(cache, { data }) {
      if (!data) return
      cache.modify({
        fields: {
          todos(existing = []) {
            const ref = cache.writeFragment({ data: data.addTodo, fragment: TODO_FIELDS })
            return [...existing, ref]
          },
        },
      })
    },
  })

  const canSave = title.trim().length > 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSave || loading) return
    setError(null)
    try {
      await addTodo({ variables: { title: title.trim() } })
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col bg-white">
      <header className="flex items-center px-4 pb-2 pt-6">
        <IconButton onClick={() => navigate('/')} aria-label="Back" className="mr-2">
          <ChevronLeftIcon />
        </IconButton>
        <h1 className="text-xl font-semibold text-black">New Task</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6 pt-6 sm:flex-none">
        <TextField
          label="Task description"
          placeholder="What needs to be done?"
          autoFocus
          maxLength={200}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError(null)
          }}
        />
        <FormError message={error} />
        {/* Phones: button at the bottom like the mockup. Desktop: right under the field. */}
        <div className="flex-1 sm:hidden" />
        <div className="pb-6 sm:pt-2">
          <Button type="submit" loading={loading} disabled={!canSave}>
            Save task
          </Button>
        </div>
      </form>
    </main>
  )
}
