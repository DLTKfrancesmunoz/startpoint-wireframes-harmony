/**
 * ShellLayout – converted from Harmony ShellLayout.astro (assembly).
 * Composes: header placeholder, LeftSidebar, RightSidebar, ShellPageHeader, Card, ShellFooter.
 * VP dark variant: footer with tabs, no floating nav, VP sidebars.
 */

import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { ShellHeader } from './ShellHeader';
import { ShellFooter, type Tab } from './ShellFooter';
import { ProjectsView } from '../ProjectsView';
import './ShellLayout.css';

const SAMPLE_TABS: Tab[] = [
  { id: 'tab-1', label: 'Home', active: true },
  { id: 'tab-2', label: 'Projects' },
  { id: 'tab-3', label: 'Reports' },
];

export default function ShellLayout() {
  const showRightSidebar = true;
  const effectiveHasFooter = true;
  const showFloatingNav = false;
  const isCPVariant = false; // VP variant
  const leftVariant = 'vp';
  const rightVariant = 'vp';

  return (
    <div
      className="shell-layout"
      data-cp-variant={String(isCPVariant)}
      data-use-theme-detection="false"
    >
      <div
        className="shell-layout__container"
        data-has-footer={String(effectiveHasFooter)}
        data-has-floating-nav={String(showFloatingNav)}
        data-has-right-sidebar={String(showRightSidebar)}
        data-footer-variant="default"
      >
        <ShellHeader
          productName="Startpoint"
          logoSrc="/logos/CPVPLogo.svg"
          showCompanyPicker
          className="shell-layout__header"
        />

        <LeftSidebar variant={leftVariant} className="shell-layout__left-sidebar" />
        {showRightSidebar && (
          <RightSidebar variant={rightVariant} className="shell-layout__right-sidebar" />
        )}

        <main className="shell-layout__main">
          <ProjectsView />
        </main>

        {effectiveHasFooter && (
          <ShellFooter
            tabs={SAMPLE_TABS}
            showAddTab
            variant="default"
            className="shell-layout__footer"
          />
        )}
      </div>
    </div>
  );
}
