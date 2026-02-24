/**
 * ShellPageHeader – converted from Harmony ShellPageHeader.astro.
 */

import { Button, type ButtonConfig } from './Button';
import './ShellPageHeader.css';

export type { ButtonConfig };

export interface ShellPageHeaderProps {
  title: string;
  subtitle?: string;
  showDefaultButtons?: boolean;
  primaryButton?: ButtonConfig;
  outlineButton1?: ButtonConfig;
  outlineButton2?: ButtonConfig;
  outlineButton3?: ButtonConfig;
  className?: string;
}

const DEFAULT_PRIMARY: ButtonConfig = { text: 'Primary' };
const DEFAULT_OUTLINE: ButtonConfig = { text: 'Secondary' };

export function ShellPageHeader({
  title,
  subtitle,
  showDefaultButtons = true,
  primaryButton,
  outlineButton1,
  outlineButton2,
  outlineButton3,
  className = '',
}: ShellPageHeaderProps) {
  const useDefaultButtons =
    showDefaultButtons &&
    primaryButton === undefined &&
    outlineButton1 === undefined &&
    outlineButton2 === undefined &&
    outlineButton3 === undefined;
  const effectiveOutline1 = useDefaultButtons ? DEFAULT_OUTLINE : outlineButton1;
  const effectiveOutline2 = outlineButton2;
  const effectiveOutline3 = outlineButton3;
  const effectivePrimary = useDefaultButtons ? DEFAULT_PRIMARY : primaryButton;
  const outlineButtons = [effectiveOutline1, effectiveOutline2, effectiveOutline3].filter(
    (b): b is ButtonConfig => Boolean(b)
  );
  const showDefaultActions = outlineButtons.length > 0 || effectivePrimary;

  return (
    <header className={`shell-page-header ${className}`}>
      <div className="shell-page-header__left">
        <h1 className="shell-page-header__title">{title}</h1>
        {subtitle && <p className="shell-page-header__subtitle">{subtitle}</p>}
      </div>
      {showDefaultActions ? (
        <div className="shell-page-header__actions">
          {outlineButtons.map((button) => (
            <Button
              key={button.text}
              variant="secondary"
              buttonType="pageHeader"
              size="md"
              icon={button.icon}
              href={button.href}
              onClick={button.onClick}
            >
              {button.text}
            </Button>
          ))}
          {effectivePrimary && (
            <Button
              variant="primary"
              buttonType="pageHeader"
              size="md"
              icon={effectivePrimary.icon}
              href={effectivePrimary.href}
              onClick={effectivePrimary.onClick}
            >
              {effectivePrimary.text}
            </Button>
          )}
        </div>
      ) : null}
    </header>
  );
}
