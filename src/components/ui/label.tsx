import type { LabelHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className, ...props }: LabelProps): React.ReactElement {
  return <label className={cn('text-sm font-semibold text-foreground', className)} {...props} />
}
