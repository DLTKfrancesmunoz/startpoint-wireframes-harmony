/**
 * Alert – converted from Harmony Alert.astro.
 * Notification with variant (info, success, warning, error); optional enhanced style with link/buttons.
 */

import type { ReactNode } from 'react';
import { Icon } from './Icon';
import clsx from 'clsx';

const DEFAULT_ICONS: Record<string, string> = {
  info: 'information-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
};

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  style?: 'default' | 'enhanced';
  title?: string;
  dismissible?: boolean;
  icon?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  children?: ReactNode;
  onDismiss?: () => void;
}

export function Alert({
  variant = 'info',
  style = 'default',
  title,
  dismissible = false,
  icon,
  linkText,
  linkHref,
  className = '',
  children,
  onDismiss,
}: AlertProps) {
  const alertIcon = icon ?? DEFAULT_ICONS[variant];
  const hasLink = linkText && linkHref;

  const classes = clsx(
    'alert',
    `alert--${variant}`,
    style === 'enhanced' && 'alert--enhanced',
    className
  );

  const message = (
    <div className="alert__message">
      {children ?? 'Alert message. Override by passing content.'}
    </div>
  );

  if (style === 'enhanced') {
    return (
      <div className={classes} role="alert">
        <div className="alert__border" />
        <div className="alert__content">
          <div className="alert__inner">
            <Icon name={alertIcon} className="alert__icon" />
            <div className="alert__text">
              {title != null && title !== '' && (
                <div className="alert__title">{title}</div>
              )}
              {message}
            </div>
            {dismissible && (
              <button
                type="button"
                className="alert__close"
                aria-label="Dismiss"
                onClick={onDismiss}
              >
                <Icon name="x-mark" />
              </button>
            )}
          </div>
          {hasLink && (
            <div className="alert__actions">
              <a href={linkHref} className="alert__link">
                {linkText}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classes} role="alert">
      <Icon name={alertIcon} className="alert__icon" />
      <div className="alert__content">
        {title != null && title !== '' && (
          <div className="alert__title">{title}</div>
        )}
        {message}
      </div>
      {dismissible && (
        <button
          type="button"
          className="alert__close"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <Icon name="x-mark" />
        </button>
      )}
    </div>
  );
}
