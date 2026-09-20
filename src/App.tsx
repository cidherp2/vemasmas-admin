import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AppRoutes } from '@/routes/AppRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

function App() {
  return <QueryClientProvider client={queryClient}><ThemeProvider><AuthProvider><AppRoutes /></AuthProvider></ThemeProvider><Toaster position="top-right" richColors /></QueryClientProvider>
}

export default App
