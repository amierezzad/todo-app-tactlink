import { ApolloError } from '@apollo/client'

type ServerErrorBody = { errors?: { message?: string; extensions?: { code?: string } }[] }

// The backend sends auth errors with HTTP 401, which Apollo reports as a
// network error. The real GraphQL errors are in the response body.
function getServerErrors(error: unknown) {
  if (!(error instanceof ApolloError)) return []
  if (error.graphQLErrors.length > 0) return error.graphQLErrors
  const body = (error.networkError as { result?: ServerErrorBody } | null)?.result
  return body?.errors ?? []
}

// Turn an Apollo/network error into a short message for the UI.
export function getErrorMessage(error: unknown): string {
  const [first] = getServerErrors(error)
  if (first?.message) return first.message
  if (error instanceof ApolloError && error.networkError) {
    return "Can't reach the server. Check your connection and try again."
  }
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Please try again.'
}
