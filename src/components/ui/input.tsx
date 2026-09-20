import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, type = 'text', ...props }: InputProps): React.ReactElement {
  return (
    <input
      className={cn('focus-ring flex h-10 w-full rounded-[0.55rem] border border-input bg-card px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-ring disabled:cursor-not-allowed disabled:opacity-50', className)}
      type={type}
      {...props}
    />
  )
}
