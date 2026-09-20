import { SlidersHorizontal } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsPage(): React.ReactElement {
  return <div className="mx-auto max-w-3xl space-y-6"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Preferencias</p><h1 className="font-display text-3xl font-semibold tracking-[-0.045em]">Configuración</h1><p className="mt-2 text-sm text-muted-foreground">Ajustes del espacio de trabajo.</p></div><Card><CardHeader><span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"><SlidersHorizontal className="size-4" /></span><CardTitle>Configuración del equipo</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Esta sección está preparada para tus preferencias de organización y permisos.</p></CardContent></Card></div>
}
