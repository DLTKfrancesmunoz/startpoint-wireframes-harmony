/**
 * Chip – converted from Harmony Chip.astro.
 * Compact element for tags, filters, or selections. Supports label, size, variant, selected, removable.
 */

import type { ReactNode } from 'react';
import { Icon } from './Icon';
import clsx from 'clsx';

/** Inline X icon for remove button (avoids dependency on icon manifest) */
function ChipRemoveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden width={16} height={16}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export interface ChipProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'fill' | 'outline';
  selected?: boolean;
  removable?: boolean;
  icon?: string;
  type?: 'chip' | 'horiz-dots' | 'vert-dots' | 'overflow';
  overflowCount?: number;
  className?: string;
  children?: ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
}

const iconSizeMap = { sm: 'xs' as const, md: 'sm' as const, lg: 'md' as const };

export function Chip({
  label = 'Chip',
  size = 'md',
  variant = 'fill',
  selected = false,
  removable = false,
  icon,
  type = 'chip',
  overflowCount,
  className = '',
  children,
  onRemove,
  onClick,
}: ChipProps) {
  const iconSize = iconSizeMap[size];
  const classes = clsx(
    'chip',
    `chip--${size}`,
    `chip--${variant}`,
    type !== 'chip' && `chip--${type}`,
    selected && 'chip--selected',
    className
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const content = (
    <>
      {type === 'horiz-dots' ? (
        <span className="chip__dots chip__dots--horiz" aria-label="More options">
          <svg viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="chip__dots-svg">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            <circle cx="9" cy="2" r="1.5" fill="currentColor" />
            <circle cx="16" cy="2" r="1.5" fill="currentColor" />
          </svg>
        </span>
      ) : type === 'vert-dots' ? (
        <span className="chip__dots chip__dots--vert" aria-label="More options">
          <svg viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="chip__dots-svg">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            <circle cx="2" cy="9" r="1.5" fill="currentColor" />
            <circle cx="2" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </span>
      ) : (
        <>
          {icon && <Icon name={icon} size={iconSize} />}
          {type === 'overflow' ? (
            <span className="chip__overflow-text">+{overflowCount ?? 10}</span>
          ) : (
            children ?? label
          )}
          {removable && (
            <button
              type="button"
              className="chip__remove"
              aria-label="Remove"
              onClick={handleRemove}
            >
              <ChipRemoveIcon />
            </button>
          )}
        </>
      )}
    </>
  );

  if (onClick && type === 'chip' && !removable) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}
