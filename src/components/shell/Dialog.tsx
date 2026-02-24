/**
 * Dialog – converted from Harmony Dialog.astro.
 * Modal dialog for confirmations, forms, or information.
 * Controlled via open and onClose; body scrolls, header/footer sticky.
 */

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Button } from './Button';
import './Dialog.css';

/** Inline X icon for close button (avoids dependency on icon manifest) */
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden width={20} height={20}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export interface DialogProps {
  id: string;
  title: string;
  open: boolean;
  onClose: () => void;
  className?: string;
  buttonAlignment?: 'left' | 'right';
  headerVariant?: 'default' | 'primary';
  children?: ReactNode;
  footer?: ReactNode;
}

export function Dialog({
  id,
  title,
  open,
  onClose,
  className = '',
  buttonAlignment = 'left',
  headerVariant = 'default',
  children,
  footer,
}: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  const overlayId = `${id}-overlay`;
  const titleId = `${id}-title`;
  const classes = ['dialog', className].filter(Boolean).join(' ');
  const headerClasses = [
    'dialog__header',
    `dialog__header--variant-${headerVariant}`,
  ].filter(Boolean).join(' ');
  const footerClasses = [
    'dialog__footer',
    `dialog__footer--align-${buttonAlignment}`,
  ].filter(Boolean).join(' ');

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <div
      className={`dialog-overlay ${open ? 'is-open' : ''}`}
      id={overlayId}
      data-dialog-overlay
      onClick={handleOverlayClick}
    >
      <div
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={headerClasses}>
          <h2 className="dialog__title" id={titleId}>
            {title}
          </h2>
          <button
            type="button"
            className="dialog__close"
            data-dialog-close
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="dialog__body">
          {children ?? (
            <p className="dialog__body-default">
              Dialog content. Override by passing default slot content.
            </p>
          )}
        </div>
        <div className={footerClasses}>
          {footer ?? (
            <div>
              <Button buttonType="theme" variant="primary" onClick={onClose}>
                Confirm
              </Button>
              <Button buttonType="theme" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
