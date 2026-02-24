/**
 * Label – converted from Harmony Label.astro.
 * Form label for inputs and other form elements.
 */

import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  helper?: string;
  className?: string;
  children?: ReactNode;
}

export function Label({
  htmlFor,
  required = false,
  helper,
  className = '',
  children,
}: LabelProps) {
  const classes = clsx(
    'label',
    required && 'label--required',
    className
  );
  return (
    <label htmlFor={htmlFor} className={classes}>
      {children}
      {helper != null && helper !== '' && (
        <span className="label__helper"> ({helper})</span>
      )}
    </label>
  );
}
