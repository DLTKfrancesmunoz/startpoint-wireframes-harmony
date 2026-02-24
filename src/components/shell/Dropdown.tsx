/**
 * Dropdown – converted from Harmony Dropdown.astro.
 * Select menu with trigger and options; controlled value and onChange.
 */

import { useId } from 'react';
import { useRef, useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Label } from './Label';
import clsx from 'clsx';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  labelVariant?: 'inline' | 'stacked';
  labelFor?: string;
  onChange?: (value: string) => void;
  'aria-label'?: string;
}

export function Dropdown({
  options,
  value,
  placeholder = 'Select an option',
  name,
  id: idProp,
  disabled = false,
  className = '',
  label,
  labelVariant,
  labelFor,
  onChange,
}: DropdownProps) {
  const generatedId = useId();
  const dropdownId = idProp ?? `dropdown-${generatedId.replace(/:/g, '')}`;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleTriggerClick = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
  };

  const classes = clsx('dropdown', className);
  const wrapperClasses = clsx(
    'dropdown-wrapper',
    label && labelVariant && `dropdown-wrapper--${labelVariant}`
  );

  const triggerContent = (
    <>
      <span className="dropdown__value">
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <Icon name="chevron-down" className="dropdown__chevron" />
    </>
  );

  const dropdownEl = (
    <div
      ref={ref}
      className={clsx(classes, isOpen && 'is-open')}
      data-dropdown
      id={dropdownId}
    >
      <button
        type="button"
        className="dropdown__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
      >
        {triggerContent}
      </button>
      <div className="dropdown__menu" role="listbox">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={clsx(
              'dropdown__item',
              option.value === value && 'is-selected',
              option.disabled && 'dropdown__item--disabled'
            )}
            data-value={option.value}
            disabled={option.disabled}
            role="option"
            aria-selected={option.value === value}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {name != null && (
        <input type="hidden" name={name} value={value ?? ''} readOnly />
      )}
    </div>
  );

  if (label) {
    return (
      <div className={wrapperClasses}>
        <Label
          htmlFor={labelFor ?? dropdownId}
          className={
            labelVariant === 'inline' || !labelVariant
              ? 'dropdown-wrapper__label'
              : undefined
          }
        >
          {label}
        </Label>
        {dropdownEl}
      </div>
    );
  }

  return dropdownEl;
}
