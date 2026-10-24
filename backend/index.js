import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { randomUUID } from "node:crypto";

// ---------- Schema ----------
const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Todo {
    id: ID!
    title: String!
    done: Boolean!
    createdAt: String!
  }

  type Query {
    me: User
    todos: [Todo!]!
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addTodo(title: String!): Todo!
    toggleTodo(id: ID!): Todo!
    deleteTodo(id: ID!): Boolean!
  }
`;

// ---------- In-memory "database" ----------
// Swap these for lowdb later for file persistence.
const users = []; // { id, email, password }
const todos = []; // { id, userId, title, done, createdAt }
const sessions = new Map(); // token -> userId

// ---------- Helpers ----------
const publicUser = (u) => ({ id: u.id, email: u.email });

function authError(message = "You must be logged in") {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
  });
}

function requireUser(ctx) {
  if (!ctx.user) throw authError();
  return ctx.user;
}

function createSession(user) {
  const token = randomUUID(); // dummy token, not a real JWT
  sessions.set(token, user.id);
  return { token, user: publicUser(user) };
}

// ---------- Resolvers ----------
const resolvers = {
  Query: {
    me: (_, __, ctx) => (ctx.user ? publicUser(ctx.user) : null),
    todos: (_, __, ctx) => {
      const user = requireUser(ctx);
      return todos.filter((t) => t.userId === user.id);
    },
  },

  Mutation: {
    signup: (_, { email, password }) => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password) {
        throw new GraphQLError("Email and password are required", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if (users.some((u) => u.email === normalized)) {
        throw new GraphQLError("Email already registered", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      // Dummy auth: password stored in plain text. Fine for this exercise only.
      const user = { id: randomUUID(), email: normalized, password };
      users.push(user);
      return createSession(user);
    },

    login: (_, { email, password }) => {
      const normalized = email.trim().toLowerCase();
      const user = users.find(
        (u) => u.email === normalized && u.password === password,
      );
      if (!user) throw authError("Invalid email or password");
      return createSession(user);
    },

    addTodo: (_, { title }, ctx) => {
      const user = requireUser(ctx);
      const trimmed = title.trim();
      if (!trimmed) {
        throw new GraphQLError("Title cannot be empty", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const todo = {
        id: randomUUID(),
        userId: user.id,
        title: trimmed,
        done: false,
        createdAt: new Date().toISOString(),
      };
      todos.push(todo);
      return todo;
    },

    toggleTodo: (_, { id }, ctx) => {
      const user = requireUser(ctx);
      const todo = todos.find((t) => t.id === id && t.userId === user.id);
      if (!todo) {
        throw new GraphQLError("Todo not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      todo.done = !todo.done;
      return todo;
    },

    deleteTodo: (_, { id }, ctx) => {
      const user = requireUser(ctx);
      const index = todos.findIndex((t) => t.id === id && t.userId === user.id);
      if (index === -1) return false;
      todos.splice(index, 1);
      return true;
    },
  },
};

// ---------- Server ----------
const server = new ApolloServer({ typeDefs, resolvers });

const port = Number(process.env.PORT) || 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port },
  // Runs on every request: reads "Authorization: Bearer <token>" and finds the user.
  context: async ({ req }) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const userId = token ? sessions.get(token) : null;
    const user = userId ? users.find((u) => u.id === userId) : null;
    return { user };
  },
});

console.log(`GraphQL server ready at ${url}`);
