/**
 * Link – converted from Harmony Link.astro.
 * Styled anchor element; optional external icon.
 */

import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { Icon } from './Icon';
import clsx from 'clsx';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  external?: boolean;
  muted?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Link({
  href,
  external = false,
  muted = false,
  className = '',
  children,
  target,
  rel,
  ...rest
}: LinkProps) {
  const classes = clsx('link', muted && 'link--muted', className);
  return (
    <a
      href={href}
      className={classes}
      target={target ?? (external ? '_blank' : undefined)}
      rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
      {...rest}
    >
      {children}
      {external && <Icon name="arrow-top-right-on-square" className="ml-1" size="xs" />}
    </a>
  );
}
