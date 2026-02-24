/**
 * LeftSidebar – converted from Harmony LeftSidebar.astro.
 * Scoped <style> in source: variant visibility only (same as in components.css).
 */

import clsx from 'clsx';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
import './LeftSidebar.css';

export interface NavItem {
  icon?: string;
  label: string;
  href?: string;
  active?: boolean;
  isCustom?: boolean;
  customSrc?: string;
  panelTitle?: string;
  panelIcon?: string;
  panelContentId?: string;
  useGradientHeader?: boolean;
}

export interface Section {
  items: NavItem[];
}

export type LeftSidebarVariant = 'cp' | 'vp' | 'ppm' | 'maconomy';

export interface LeftSidebarProps {
  variant?: LeftSidebarVariant;
  sections?: Section[];
  className?: string;
}

const cpSections: Section[] = [
  {
    items: [
      { icon: 'home', label: 'Welcome screen' },
      { icon: 'squares-2x2', label: 'Dashboard' },
      { icon: 'star', label: 'My menu' },
      { icon: 'clock', label: 'Recent' },
    ],
  },
  {
    items: [
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'squares-plus', label: 'Command Center' },
      { icon: 'calculator', label: 'Accounting' },
      { icon: 'chart-bar', label: 'Planning' },
      { icon: 'document-arrow-down', label: 'Capture & contracts' },
      { icon: 'clipboard-document-list', label: 'Projects' },
      { icon: 'cube', label: 'Materials' },
      { icon: 'clock', label: 'Time & expense' },
      { icon: 'users', label: 'People' },
      { icon: 'document-chart-bar', label: 'Reports' },
      { icon: 'cog-6-tooth', label: 'Admin' },
    ],
  },
];

const ppmSections: Section[] = [
  {
    items: [
      { icon: 'rectangle-group', label: 'Command Center', active: true },
      { icon: 'book-open', label: 'Programs' },
      { icon: 'briefcase', label: 'Portfolios' },
      { icon: 'building-office', label: 'Projects' },
      { icon: 'Risk Shield', label: 'Risk' },
      { icon: 'Report', label: 'Reports' },
      { icon: 'calendar-days', label: 'Calendars' },
      { icon: 'document', label: 'Codes' },
      { icon: 'wallet', label: 'Rates' },
      { icon: 'Resource', label: 'Resources' },
      { icon: 'cog-6-tooth', label: 'Settings' },
      { icon: 'plus', label: 'Add Menu' },
    ],
  },
];

const vpSections: Section[] = [
  {
    items: [
      { icon: 'rectangle-group', label: 'Command Center', active: true },
      { icon: 'book-open', label: 'Programs' },
      { icon: 'briefcase', label: 'Portfolios' },
      { icon: 'building-office', label: 'Projects' },
      { icon: 'Risk Shield', label: 'Risk' },
      { icon: 'Report', label: 'Reports' },
      { icon: 'calendar-days', label: 'Calendars' },
      { icon: 'document', label: 'Codes' },
      { icon: 'wallet', label: 'Rates' },
      { icon: 'Resource', label: 'Resources' },
      { icon: 'cog-6-tooth', label: 'Settings' },
      { icon: 'plus', label: 'Add Menu' },
    ],
  },
];

const maconomySections: Section[] = [
  {
    items: [
      { icon: 'rectangle-group', label: 'Command Center', active: true },
      { icon: 'book-open', label: 'Programs' },
      { icon: 'briefcase', label: 'Portfolios' },
      { icon: 'building-office', label: 'Projects' },
      { icon: 'Risk Shield', label: 'Risk' },
      { icon: 'Report', label: 'Reports' },
      { icon: 'calendar-days', label: 'Calendars' },
      { icon: 'document', label: 'Codes' },
      { icon: 'wallet', label: 'Rates' },
      { icon: 'Resource', label: 'Resources' },
      { icon: 'cog-6-tooth', label: 'Settings' },
      { icon: 'plus', label: 'Add Menu' },
    ],
  },
];

function getSections(variant: LeftSidebarVariant, sections?: Section[]): Section[] {
  if (sections) return sections;
  switch (variant) {
    case 'cp':
      return cpSections;
    case 'ppm':
      return ppmSections;
    case 'vp':
      return vpSections;
    case 'maconomy':
      return maconomySections;
    default:
      return cpSections;
  }
}

function renderSection(section: Section, sectionIndex: number) {
  return (
    <div key={sectionIndex} className="left-sidebar__section">
      {section.items.map((item, itemIndex) => {
        const panelTitle = item.panelTitle ?? item.label;
        const panelIcon = item.panelIcon ?? item.icon;
        const itemId = `left-sidebar-item-${sectionIndex}-${itemIndex}`;
        return (
          <a
            key={itemId}
            href={item.href ?? '#'}
            className={clsx('left-sidebar__item', item.active && 'left-sidebar__item--active')}
            data-panel-title={panelTitle}
            data-panel-icon={panelIcon ?? undefined}
            data-panel-content-id={item.panelContentId}
            data-item-id={itemId}
            data-use-gradient-header={String(item.useGradientHeader ?? false)}
            data-left-sidebar-item
          >
            <Tooltip text={item.label} position="right" className="left-sidebar__item-tooltip">
              <span className="left-sidebar__icon">
                {item.isCustom && item.customSrc ? (
                  <img src={item.customSrc} alt={item.label} className="left-sidebar__custom-icon" />
                ) : item.icon ? (
                  <Icon name={item.icon} />
                ) : null}
              </span>
            </Tooltip>
            <span className="left-sidebar__label">{item.label}</span>
          </a>
        );
      })}
    </div>
  );
}

export function LeftSidebar({
  variant = 'cp',
  sections,
  className = '',
}: LeftSidebarProps) {
  const sidebarSections = getSections(variant, sections);
  const shouldRenderAllVariants = sections == null;

  return (
    <nav
      className={clsx('left-sidebar', `left-sidebar--${variant}`, className)}
      data-variant={variant}
    >
      {shouldRenderAllVariants ? (
        <>
          <div className="left-sidebar__variant left-sidebar__variant--cp">
            {cpSections.map((section, i) => renderSection(section, i))}
          </div>
          <div className="left-sidebar__variant left-sidebar__variant--vp">
            {vpSections.map((section, i) => renderSection(section, i))}
          </div>
          <div className="left-sidebar__variant left-sidebar__variant--ppm">
            {ppmSections.map((section, i) => renderSection(section, i))}
          </div>
          <div className="left-sidebar__variant left-sidebar__variant--maconomy">
            {maconomySections.map((section, i) => renderSection(section, i))}
          </div>
        </>
      ) : (
        sidebarSections.map((section, i) => renderSection(section, i))
      )}
    </nav>
  );
}
