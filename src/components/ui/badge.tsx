import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-secondary text-secondary-foreground',
      active: 'bg-[#d8f1e4] text-[#19613f] dark:bg-[#1f4939] dark:text-[#9be1bd]',
      inactive: 'bg-muted text-muted-foreground',
      warning: 'bg-[#fff0c8] text-[#79530a] dark:bg-[#493817] dark:text-[#f4d77f]',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.ReactElement {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
