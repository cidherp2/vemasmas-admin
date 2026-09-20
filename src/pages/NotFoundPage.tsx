import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage(): React.ReactElement {
  return <div className="flex min-h-[60vh] flex-col items-center justify-center text-center"><span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><Compass className="size-6" /></span><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">404</p><h1 className="mt-2 font-display text-3xl font-semibold">Este lugar no está en el mapa.</h1><p className="mt-2 max-w-md text-sm text-muted-foreground">La página que buscas no existe o ya no está disponible.</p><Button asChild className="mt-6"><Link to="/dashboard"><ArrowLeft className="size-4" />Volver al dashboard</Link></Button></div>
}
