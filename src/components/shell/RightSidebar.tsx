/**
 * RightSidebar – converted from Harmony RightSidebar.astro.
 * Includes icon color pitfall: dark-mode filter for .right-sidebar__icon-img and .right-sidebar__dela-logo--default.
 */

import clsx from 'clsx';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
import './RightSidebar.css';

export interface RightSidebarNavItem {
  icon?: string;
  label: string;
  href?: string;
  isCustom?: boolean;
  customSrc?: string;
  customSrcActive?: string;
  panelTitle?: string;
  panelIcon?: string;
  panelContentId?: string;
  useGradientHeader?: boolean;
}

export interface RightSidebarSection {
  items: RightSidebarNavItem[];
}

export type RightSidebarVariant = 'cp' | 'vp' | 'ppm' | 'maconomy';

export interface RightSidebarProps {
  variant?: RightSidebarVariant;
  sections?: RightSidebarSection[];
  className?: string;
}

const cpSections: RightSidebarSection[] = [
  {
    items: [
      { label: 'Dela AI', isCustom: true, customSrc: '/RS_DelaDefault.svg', customSrcActive: '/RS_Dela_Active.svg' },
      { icon: 'bell', label: 'Notifications' },
      { icon: 'arrow-up-tray', label: 'Files' },
    ],
  },
  {
    items: [
      { icon: 'printer', label: 'Print' },
      { icon: 'view-columns', label: 'Layout Options' },
    ],
  },
  {
    items: [
      { icon: 'mic-slash', label: 'Microphone' },
      { icon: 'signal-slash', label: 'Offline' },
      { icon: 'command-line', label: 'Keyboard Shortcuts' },
      { icon: 'question-mark-circle', label: 'Help' },
    ],
  },
];

const ppmSections: RightSidebarSection[] = [
  {
    items: [
      { label: 'Dela AI', isCustom: true, customSrc: '/RS_DelaDefault.svg', customSrcActive: '/RS_Dela_Active.svg' },
      { icon: 'pencil-square', label: 'Edit' },
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'ellipsis-horizontal-circle', label: 'Actions' },
      { icon: 'related', label: 'Related' },
      { icon: 'template', label: 'Templates' },
      { icon: 'cloud-arrow-up', label: 'Upload' },
      { icon: 'cloud-arrow-down', label: 'Download' },
    ],
  },
  {
    items: [
      { icon: 'bell', label: 'Notifications' },
      { icon: 'question-mark-circle', label: 'Help' },
      { icon: 'share', label: 'Share' },
    ],
  },
  {
    items: [
      { icon: 'globe-alt', label: 'Accessibility' },
      { icon: 'language', label: 'Language' },
      { icon: 'moon', label: 'Dark Mode' },
    ],
  },
];

const vpSections: RightSidebarSection[] = [
  {
    items: [
      { label: 'Dela AI', isCustom: true, customSrc: '/RS_DelaDefault.svg', customSrcActive: '/RS_Dela_Active.svg' },
      { icon: 'pencil-square', label: 'Edit' },
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'ellipsis-horizontal-circle', label: 'Actions' },
      { icon: 'related', label: 'Related' },
      { icon: 'template', label: 'Templates' },
      { icon: 'cloud-arrow-up', label: 'Upload' },
      { icon: 'cloud-arrow-down', label: 'Download' },
    ],
  },
  {
    items: [
      { icon: 'bell', label: 'Notifications' },
      { icon: 'question-mark-circle', label: 'Help' },
      { icon: 'share', label: 'Share' },
    ],
  },
  {
    items: [
      { icon: 'globe-alt', label: 'Accessibility' },
      { icon: 'language', label: 'Language' },
      { icon: 'moon', label: 'Dark Mode' },
    ],
  },
];

const maconomySections: RightSidebarSection[] = [
  {
    items: [
      { label: 'Dela AI', isCustom: true, customSrc: '/RS_DelaDefault.svg', customSrcActive: '/RS_Dela_Active.svg' },
      { icon: 'pencil-square', label: 'Edit' },
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'ellipsis-horizontal-circle', label: 'Actions' },
      { icon: 'related', label: 'Related' },
      { icon: 'template', label: 'Templates' },
      { icon: 'cloud-arrow-up', label: 'Upload' },
      { icon: 'cloud-arrow-down', label: 'Download' },
    ],
  },
  {
    items: [
      { icon: 'bell', label: 'Notifications' },
      { icon: 'question-mark-circle', label: 'Help' },
      { icon: 'share', label: 'Share' },
    ],
  },
  {
    items: [
      { icon: 'globe-alt', label: 'Accessibility' },
      { icon: 'language', label: 'Language' },
      { icon: 'moon', label: 'Dark Mode' },
    ],
  },
];

function getSections(variant: RightSidebarVariant, sections?: RightSidebarSection[]): RightSidebarSection[] {
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

function renderSection(section: RightSidebarSection, sectionIndex: number) {
  return (
    <div key={sectionIndex} className="right-sidebar__section">
      {section.items.map((item, itemIndex) => {
        const panelTitle = item.panelTitle ?? item.label;
        const panelIcon = item.panelIcon ?? item.icon;
        const itemId = `right-sidebar-item-${sectionIndex}-${itemIndex}`;
        return (
          <a
            key={itemId}
            href={item.href ?? '#'}
            className="right-sidebar__item"
            data-panel-title={panelTitle}
            data-panel-icon={panelIcon ?? undefined}
            data-panel-content-id={item.panelContentId}
            data-item-id={itemId}
            data-use-gradient-header={String(item.useGradientHeader ?? false)}
            data-right-sidebar-item
          >
            <span className="right-sidebar__label">{item.label}</span>
            <Tooltip text={item.label} position="left" className="right-sidebar__item-tooltip">
              <span className="right-sidebar__icon">
                {item.isCustom && item.customSrc ? (
                  item.customSrcActive ? (
                    <>
                      <Icon
                        name="RS_DelaDefault.svg"
                        className="right-sidebar__dela-logo right-sidebar__dela-logo--default"
                        width={36}
                        height={36}
                      />
                      <Icon
                        name="RS_Dela_Active.svg"
                        className="right-sidebar__dela-logo right-sidebar__dela-logo--active"
                        width={36}
                        height={36}
                      />
                    </>
                  ) : (
                    <Icon
                      name="RS_DelaDefault.svg"
                      className="right-sidebar__dela-logo"
                      width={36}
                      height={36}
                    />
                  )
                ) : item.icon ? (
                  <Icon name={item.icon} />
                ) : null}
              </span>
            </Tooltip>
          </a>
        );
      })}
    </div>
  );
}

export function RightSidebar({
  variant = 'cp',
  sections,
  className = '',
}: RightSidebarProps) {
  const sidebarSections = getSections(variant, sections);
  const shouldRenderAllVariants = sections == null;

  return (
    <nav
      className={clsx('right-sidebar', `right-sidebar--${variant}`, className)}
      data-variant={variant}
    >
      {shouldRenderAllVariants ? (
        <>
          <div className="right-sidebar__variant right-sidebar__variant--cp">
            {cpSections.map((section, i) => renderSection(section, i))}
          </div>
          <div className="right-sidebar__variant right-sidebar__variant--vp">
            {vpSections.map((section, i) => renderSection(section, i))}
          </div>
          <div className="right-sidebar__variant right-sidebar__variant--ppm">
            {ppmSections.map((section, i) => renderSection(section, i))}
          </div>
          <div className="right-sidebar__variant right-sidebar__variant--maconomy">
            {maconomySections.map((section, i) => renderSection(section, i))}
          </div>
        </>
      ) : (
        sidebarSections.map((section, i) => renderSection(section, i))
      )}
    </nav>
  );
}
