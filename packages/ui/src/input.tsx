import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'block w-full rounded-md border-0 px-3 py-2 text-slate-900 shadow-sm',
        'ring-1 ring-inset ring-slate-300 placeholder:text-slate-400',
        'focus:ring-2 focus:ring-inset focus:ring-indigo-600',
        'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
        'sm:text-sm sm:leading-6',
        className,
      )}
      {...rest}
    />
  );
});
