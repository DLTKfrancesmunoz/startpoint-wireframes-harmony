/**
 * ShellFooter – converted from Harmony ShellFooter.astro.
 * Wraps TabStrip; adds pin icon to active tabs; footer-specific styles (incl. dark tab labels).
 */

import { TabStrip, type Tab } from './TabStrip';
import './ShellFooter.css';

export type { Tab };

export interface ShellFooterProps {
  tabs?: Tab[];
  showMore?: boolean;
  moreCount?: number;
  overflowTabs?: Tab[];
  showAddTab?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export function ShellFooter({
  tabs = [],
  showMore = false,
  moreCount: _moreCount = 0,
  overflowTabs = [],
  showAddTab = true,
  variant = 'default',
  className = '',
}: ShellFooterProps) {
  const overflowMode = showMore && overflowTabs.length > 0 ? 'manual' : 'none';
  const tabsWithPinIcon = tabs.map((tab) => ({
    ...tab,
    icon: tab.active ? 'pin' : tab.icon ?? undefined,
    iconPosition: (tab.active ? 'left' : (tab.iconPosition ?? (tab.icon ? 'left' : undefined))) as 'left' | 'right' | 'top' | undefined,
  }));
  const overflowTabsWithPinIcon = overflowTabs.map((tab) => ({
    ...tab,
    icon: tab.active ? 'pin' : tab.icon ?? undefined,
    iconPosition: (tab.active ? 'left' : (tab.iconPosition ?? (tab.icon ? 'left' : undefined))) as 'left' | 'right' | 'top' | undefined,
  }));
  return (
    <div
      className={`shell-footer ${variant === 'compact' ? 'shell-footer--compact' : ''} ${className}`.trim()}
      data-variant={variant}
    >
      <TabStrip
        tabs={tabsWithPinIcon}
        showAddTab={showAddTab}
        overflowMode={overflowMode}
        overflowTabs={overflowTabsWithPinIcon}
        variant={variant}
        className="shell-footer__tabstrip"
      />
    </div>
  );
}
