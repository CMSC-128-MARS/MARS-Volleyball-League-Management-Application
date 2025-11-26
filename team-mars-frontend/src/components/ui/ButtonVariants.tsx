import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] pg1-bold  transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive dark:aria-invalid:ring-destructive aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        /*Primary */
        default:
          'bg-primary primary-foreground hover:bg-primary-alt hover:text-primary-alt-foreground',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive dark:focus-visible:ring-destructive dark:bg-destructive',
        outline:
          'border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        'outline-primary':
          'border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground shadow-xs',
        'outline-destructive':
          'border border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-white shadow-xs',
        'outline-secondary':
          'border border-secondary text-secondary-foreground bg-transparent hover:bg-secondary hover:text-secondary-foreground shadow-xs',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-alt hover:text-secondary-alt-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-auto px-[16px] py-[12px] gap-[8px] has-[>svg]:px-3',
        sm: 'h-auto rounded-[2px] px-[12px] py-[8px] gap-[4px] has-[>svg]:px-2.5',
        lg: 'h-auto rounded-[2px] px-[32px] py-[16px] gap-[8px] has-[>svg]:px-4',
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

export { buttonVariants };
