import { gql } from '@apollo/client'

export type Todo = {
  __typename?: 'Todo'
  id: string
  title: string
  done: boolean
  createdAt: string
}

export type User = { __typename?: 'User'; id: string; email: string }

export type AuthPayload = { token: string; user: User }

export const TODO_FIELDS = gql`
  fragment TodoFields on Todo {
    id
    title
    done
    createdAt
  }
`

export const TODOS_QUERY = gql`
  query Todos {
    todos {
      ...TodoFields
    }
  }
  ${TODO_FIELDS}
`

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`

export const ADD_TODO_MUTATION = gql`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      ...TodoFields
    }
  }
  ${TODO_FIELDS}
`

export const TOGGLE_TODO_MUTATION = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
      done
    }
  }
`

export const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`
