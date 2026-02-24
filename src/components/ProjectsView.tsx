/**
 * Projects view – ShellPageHeader + Card with Harmony table (or empty state) + Create Project modal.
 * Per layout-builder: spacing var(--space-6) between header and first Card.
 */

import { useState } from 'react';
import { ShellPageHeader } from './shell/ShellPageHeader';
import { Card } from './shell/Card';
import { CreateProjectModal } from './CreateProjectModal';
import type { CreateProjectForm } from './CreateProjectModal';
import type { Project } from '../types/project';
import { isClientRequiredBillingType } from '../types/project';

const MOCK_CLIENT_LABELS: Record<string, string> = {
  c1: 'Acme Corp',
  c2: 'Brookside Dev',
  c3: 'Harbor View LLC',
};

function clientLabel(clientId: string | undefined): string {
  if (!clientId) return '—';
  return MOCK_CLIENT_LABELS[clientId] ?? clientId;
}

export interface ProjectsViewProps {
  projects: Project[];
  onProjectCreated?: (form: CreateProjectForm) => void;
  onSelectProject?: (project: Project) => void;
}

export function ProjectsView({
  projects,
  onProjectCreated,
  onSelectProject,
}: ProjectsViewProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <ShellPageHeader
          title="Projects"
          subtitle="Create and manage projects"
          showDefaultButtons={false}
          primaryButton={{
            text: '+ New Project',
            onClick: () => setCreateModalOpen(true),
          }}
        />
        <Card primary elevated withHeader headerTitle="Projects" headerSubtitle="">
          <div className="card__body" style={{ padding: 0 }}>
            {projects.length === 0 ? (
              <p
                style={{
                  padding: 'var(--space-4)',
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                No projects yet. Click &quot;+ New Project&quot; to create one.
              </p>
            ) : (
              <div className="table-wrapper overflow-x-auto">
                <table className="table table--header-gray">
                  <thead>
                    <tr>
                      <th>Project name</th>
                      <th>Project ID</th>
                      <th>Status</th>
                      <th>Client</th>
                      <th>Billing type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project.projectId}
                        onClick={() => onSelectProject?.(project)}
                        style={{
                          cursor: onSelectProject ? 'pointer' : undefined,
                        }}
                        role={onSelectProject ? 'button' : undefined}
                        tabIndex={onSelectProject ? 0 : undefined}
                        onKeyDown={
                          onSelectProject
                            ? (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  onSelectProject(project);
                                }
                              }
                            : undefined
                        }
                      >
                        <td>{project.projectName || '—'}</td>
                        <td>{project.projectId || '—'}</td>
                        <td>{project.status}</td>
                        <td>
                          {isClientRequiredBillingType(project.billingType)
                            ? clientLabel(project.clientId)
                            : '—'}
                        </td>
                        <td>{project.billingType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
      <CreateProjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateProject={(form) => {
          setCreateModalOpen(false);
          onProjectCreated?.(form);
        }}
      />
    </>
  );
}
