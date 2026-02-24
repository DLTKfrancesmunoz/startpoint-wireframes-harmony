/**
 * Button – minimal conversion for ShellPageHeader (primary/secondary, pageHeader, md).
 */

import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface ButtonConfig {
  text: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
}

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'destructive' | 'dela' | 'dela-pill';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  buttonType?: 'theme' | 'pageHeader';
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  href?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  buttonType = 'theme',
  size = 'md',
  icon,
  iconPosition = 'left',
  href,
  className = '',
  children,
  onClick,
}: ButtonProps) {
  const hasContent = Boolean(children);
  const isIconOnly = Boolean(icon && !hasContent);
  const isDelaVariant = variant === 'dela' || variant === 'dela-pill';
  const classes = [
    'btn',
    `btn--${variant}`,
    buttonType === 'pageHeader' && !isDelaVariant && 'btn--page-header',
    isIconOnly ? `btn--icon-${size}` : `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {isDelaVariant && <img src="/Stars.svg" alt="" className="btn__dela-stars" />}
      {icon && iconPosition === 'left' && <Icon name={icon} size={size === 'lg' ? 'md' : size === 'md' ? 'sm' : size} />}
      {children}
      {icon && iconPosition === 'right' && <Icon name={icon} size={size === 'lg' ? 'md' : size === 'md' ? 'sm' : size} />}
    </>
  );
  const common = { className: classes, onClick };
  if (href) {
    return <a href={href} {...common as AnchorHTMLAttributes<HTMLAnchorElement>}>{content}</a>;
  }
  return <button type="button" {...common as ButtonHTMLAttributes<HTMLButtonElement>}>{content}</button>;
}
