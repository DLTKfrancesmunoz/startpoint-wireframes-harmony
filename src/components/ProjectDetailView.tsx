/**
 * Project detail view – ShellPageHeader + Card showing project info.
 * Shown after creating a project or when opening a project from the list.
 */

import { ShellPageHeader } from './shell/ShellPageHeader';
import { Card } from './shell/Card';
import type { CreateProjectForm } from './CreateProjectModal';

const formGroupStyle = { marginBottom: 'var(--space-4)' };
const labelStyle = { fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' };
const valueStyle = { fontSize: 'var(--text-base)' };

export interface ProjectDetailViewProps {
  project: CreateProjectForm;
  onBack: () => void;
}

export function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <ShellPageHeader
        title={project.projectName || 'Untitled Project'}
        subtitle={project.projectId ? `Project ID: ${project.projectId}` : undefined}
        showDefaultButtons={false}
        outlineButton1={{ text: 'Back to Projects', onClick: onBack }}
      />
      <Card primary elevated withHeader headerTitle="Project details" headerSubtitle="">
        <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={formGroupStyle}>
            <div style={labelStyle}>Project name</div>
            <div style={valueStyle}>{project.projectName || '—'}</div>
          </div>
          <div style={formGroupStyle}>
            <div style={labelStyle}>Project ID</div>
            <div style={valueStyle}>{project.projectId || '—'}</div>
          </div>
          <div style={formGroupStyle}>
            <div style={labelStyle}>Status</div>
            <div style={valueStyle}>{project.status}</div>
          </div>
          <div style={formGroupStyle}>
            <div style={labelStyle}>Billing type</div>
            <div style={valueStyle}>{project.billingType}</div>
          </div>
          {project.clientId && (
            <div style={formGroupStyle}>
              <div style={labelStyle}>Client</div>
              <div style={valueStyle}>{project.clientId}</div>
            </div>
          )}
          <div style={formGroupStyle}>
            <div style={labelStyle}>Project manager(s)</div>
            <div style={valueStyle}>
              {project.projectManagerIds.length > 0
                ? project.projectManagerIds.join(', ')
                : '—'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
