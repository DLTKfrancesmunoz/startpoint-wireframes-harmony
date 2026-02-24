/**
 * TabStrip – converted from Harmony TabStrip.astro.
 * Full scoped styles copied from source <style> block (TabStrip pitfall).
 */

import clsx from 'clsx';
import { Icon } from './Icon';
import './TabStrip.css';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  iconPosition?: 'left' | 'right' | 'top';
  active?: boolean;
  disabled?: boolean;
  href?: string;
}

export interface TabStripProps {
  tabs?: Tab[];
  showAddTab?: boolean;
  addTabLabel?: string;
  overflowMode?: 'auto' | 'manual' | 'none';
  overflowTabs?: Tab[];
  variant?: 'default' | 'compact';
  iconPosition?: 'left' | 'right' | 'top';
  className?: string;
}

const TABSTRIP_ID = `tabstrip-${Math.random().toString(36).slice(2, 11)}`;

export function TabStrip({
  tabs = [],
  showAddTab = false,
  addTabLabel = 'Add Tab',
  overflowMode = 'auto',
  overflowTabs = [],
  variant = 'default',
  iconPosition: componentIconPosition,
  className = '',
}: TabStripProps) {
  return (
    <div
      className={clsx('tabstrip', variant === 'compact' && 'tabstrip--compact', className)}
      data-tabstrip
      data-variant={variant}
      data-overflow-mode={overflowMode}
      id={TABSTRIP_ID}
    >
      <nav role="tablist" aria-label="Tabs" className="tabstrip__nav">
        <div className="tabstrip__container">
          <div className="tabstrip__tabs" data-tabstrip-tabs>
            {tabs.map((tab) => {
              const iconPosition = componentIconPosition ?? tab.iconPosition ?? 'left';
              const iconModifier =
                iconPosition === 'top'
                  ? 'tab--icon-top'
                  : iconPosition === 'right'
                    ? 'tab--icon-right'
                    : 'tab--icon-left';
              const tabContent = (
                <>
                  {tab.icon && iconPosition === 'top' && (
                    <span className="tab__icon-wrapper">
                      <Icon name={tab.icon} size="sm" className="tab__icon" />
                    </span>
                  )}
                  {tab.icon && (iconPosition === 'left' || iconPosition === 'top') && iconPosition !== 'top' && (
                    <Icon name={tab.icon} size="sm" className="tab__icon" />
                  )}
                  <span className="tab__label">{tab.label}</span>
                  {tab.icon && iconPosition === 'right' && (
                    <Icon name={tab.icon} size="sm" className="tab__icon" />
                  )}
                </>
              );
              const tabClasses = clsx(
                'tab',
                tab.active && 'is-active',
                tab.disabled && 'tab--disabled',
                iconModifier
              );
              const tabIndex = tab.active && !tab.disabled ? 0 : -1;
              const commonTabProps = {
                role: 'tab' as const,
                'aria-selected': tab.active,
                'aria-disabled': tab.disabled ?? false,
                className: tabClasses,
                tabIndex,
                'data-tab-id': tab.id,
                'data-tab-icon': tab.icon ?? '',
              };
              if (tab.href) {
                return (
                  <a key={tab.id} href={tab.href} {...commonTabProps}>
                    {tabContent}
                  </a>
                );
              }
              return (
                <button key={tab.id} type="button" disabled={tab.disabled} {...commonTabProps}>
                  {tabContent}
                </button>
              );
            })}
          </div>
          {showAddTab && (
            <button type="button" className="tab tabstrip__add" aria-label={addTabLabel} data-tabstrip-add>
              <Icon name="plus" size="sm" />
              <span>{addTabLabel}</span>
            </button>
          )}
          {overflowMode !== 'none' && (
            <div className="tabstrip__more-wrapper" data-tabstrip-more style={{ display: 'none' }}>
              <button
                type="button"
                className="tab tabstrip__more"
                aria-label="Show more tabs"
                aria-haspopup="true"
                aria-expanded="false"
                data-tabstrip-more-btn
              >
                <span data-tabstrip-more-label>More ({overflowTabs.length})</span>
                <Icon name="ellipsis-horizontal" size="sm" />
              </button>
              <div className="tabstrip__dropdown" role="menu" aria-label="Overflow tabs menu" data-tabstrip-dropdown>
                <div className="tabstrip__dropdown-section" data-tabstrip-dropdown-items>
                  {overflowTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={clsx('tabstrip__dropdown-item', tab.active && 'is-active')}
                      role="menuitem"
                    >
                      <button type="button" className="tabstrip__dropdown-item-label" data-tab-id={tab.id} data-action="select-tab">
                        {tab.icon && <Icon name={tab.icon} size="sm" className="tabstrip__dropdown-item-icon" />}
                        <span>{tab.label}</span>
                      </button>
                      <div className="tabstrip__dropdown-item-actions">
                        <button
                          type="button"
                          className="tabstrip__dropdown-action-btn"
                          data-tab-id={tab.id}
                          data-action="open-new-window"
                          aria-label={`Open ${tab.label} in new window`}
                          title="Open in new window"
                        >
                          <Icon name="arrow-top-right-on-square" size="sm" />
                        </button>
                        <button
                          type="button"
                          className="tabstrip__dropdown-action-btn"
                          data-tab-id={tab.id}
                          data-action="close-tab"
                          aria-label={`Close ${tab.label}`}
                          title="Close"
                        >
                          <Icon name="x-mark" size="sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
