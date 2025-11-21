import RemixIcon from '@/components/RemixIcon'
import { cn } from '@/lib/utils'
import * as React from 'react'

type InputProps = React.ComponentProps<'input'> & {
  prefixIcon?: string
  suffixIcon?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefixIcon, suffixIcon, ...props }, ref) => {
    return (
      <div className={cn('relative w-full')}>
        {prefixIcon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <RemixIcon name={prefixIcon} size={18} />
          </span>
        ) : null}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:border-color-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            prefixIcon ? 'pl-9' : '',
            suffixIcon ? 'pr-9' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {suffixIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <RemixIcon name={suffixIcon} size={18} />
          </span>
        ) : null}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
