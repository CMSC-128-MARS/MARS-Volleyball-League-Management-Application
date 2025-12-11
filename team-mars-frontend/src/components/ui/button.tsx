import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] pg1-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-2 border-primary text-primary shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        'outline-primary':
          'border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground shadow-xs',
        'outline-destructive':
          'border border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-white shadow-xs',
        'outline-secondary':
          'border border-secondary text-secondary-foreground bg-transparent hover:bg-secondary hover:text-secondary-foreground shadow-xs',
        'nav-primary':
          'border-2 border-primary text-gray-600 bg-transparent hover:bg-transparent hover:text-foreground shadow-xs group cursor-pointer [&_svg]:transition-transform',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer',
        'icon-slate':
          'bg-slate-600 border-2 border-white text-white hover:bg-white hover:text-primary rounded-[2px] shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-auto px-4 py-2 has-[>svg]:px-3',
        xs: 'h-auto rounded-[2px] gap-1 px-[12px] py-[6px] has-[>svg]:px-2',
        sm: 'h-auto rounded-[2px] gap-1.5 px-[16px] py-[8px] has-[>svg]:px-2.5',
        lg: 'h-auto rounded-[2px] gap-2 px-[24px] py-[12px] has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  const isDisabled = Boolean(disabled || isLoading || props.disabled);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />}
      {children}
    </Comp>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
