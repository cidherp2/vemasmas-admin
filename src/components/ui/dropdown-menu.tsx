import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export function DropdownMenuContent({ className, sideOffset = 8, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>): React.ReactElement {
  return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.Content className={cn('z-50 min-w-44 rounded-[0.65rem] border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none', className)} sideOffset={sideOffset} {...props} /></DropdownMenuPrimitive.Portal>
}

export function DropdownMenuItem({ className, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>): React.ReactElement {
  return <DropdownMenuPrimitive.Item className={cn('focus-ring flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none hover:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>): React.ReactElement {
  return <DropdownMenuPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
}
