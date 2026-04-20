import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 5, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'block w-full rounded-md border-0 px-3 py-2 text-slate-900 shadow-sm',
        'ring-1 ring-inset ring-slate-300 placeholder:text-slate-400',
        'focus:ring-2 focus:ring-inset focus:ring-indigo-600',
        'sm:text-sm sm:leading-6',
        className,
      )}
      {...rest}
    />
  );
});
