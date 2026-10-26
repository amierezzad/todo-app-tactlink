import '@fontsource/metropolis/400.css'
import '@fontsource/metropolis/500.css'
import '@fontsource/metropolis/600.css'
import '@fontsource/metropolis/700.css'
import './index.css'

import { ApolloProvider } from '@apollo/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from './App'
import { client } from './lib/apollo'
import { AuthProvider } from './lib/auth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
