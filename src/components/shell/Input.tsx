/**
 * Input – converted from Harmony Input.astro.
 * Text input with optional label, error state, and icon.
 */

import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import { Icon } from './Icon';
import { Label } from './Label';
import clsx from 'clsx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id?: string;
  label?: string;
  labelVariant?: 'inline' | 'stacked';
  labelFor?: string;
  error?: boolean;
  errorMessage?: string;
  icon?: string;
  className?: string;
}

export function Input({
  type = 'text',
  id: idProp,
  label,
  labelVariant,
  labelFor,
  error = false,
  errorMessage,
  icon,
  required = false,
  disabled = false,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = idProp ?? `input-${generatedId.replace(/:/g, '')}`;

  const inputClasses = clsx(
    'input',
    icon && 'input--with-icon',
    error && 'input--error',
    className
  );

  const wrapperClasses = clsx(
    'input-form-wrapper',
    label && labelVariant && `input-form-wrapper--${labelVariant}`
  );

  const inputEl = (
    <div className="input-wrapper">
      {icon && (
        <Icon name={icon} size="sm" className="input-wrapper__icon" />
      )}
      <input
        type={type}
        id={inputId}
        disabled={disabled}
        required={required}
        className={inputClasses}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={
          error && errorMessage ? `${inputId}-error` : ariaDescribedby
        }
        {...rest}
      />
      {error && errorMessage && (
        <p id={`${inputId}-error`} className="input-wrapper__error">
          {errorMessage}
        </p>
      )}
    </div>
  );

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label
          htmlFor={labelFor ?? inputId}
          required={required}
          className={
            labelVariant === 'inline' || !labelVariant
              ? 'input-form-wrapper__label'
              : undefined
          }
        >
          {label}
        </Label>
        {inputEl}
      </div>
    );
  }

  return inputEl;
}
