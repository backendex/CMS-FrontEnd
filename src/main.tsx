import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Aquí están declarados
import './index.css'
import App from './App.tsx'

// Creamos la instancia
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Aquí es donde se USAN. 
      Todo lo que esté dentro de este Provider podrá usar hooks como useMutation 
    */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
