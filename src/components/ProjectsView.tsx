/**
 * Projects view – ShellPageHeader + Card (list/empty state) + Create Project modal.
 * Per layout-builder: spacing var(--space-6) between header and first Card.
 */

import { useState } from 'react';
import { ShellPageHeader } from './shell/ShellPageHeader';
import { Card } from './shell/Card';
import { CreateProjectModal } from './CreateProjectModal';
import type { CreateProjectForm } from './CreateProjectModal';

export interface ProjectsViewProps {
  onProjectCreated?: (form: CreateProjectForm) => void;
}

export function ProjectsView({ onProjectCreated }: ProjectsViewProps) {
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
          <div className="card__body">
            <p style={{ color: 'var(--text-secondary)' }}>
              No projects yet. Click &quot;+ New Project&quot; to create one.
            </p>
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
