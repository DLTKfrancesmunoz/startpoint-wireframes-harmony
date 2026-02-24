/**
 * Create Project modal – creation path boxes, form fields per plan, Chip/Link.
 */

import { useState, useMemo } from 'react';
import { Dialog } from './shell/Dialog';
import { Input } from './shell/Input';
import { Dropdown, type DropdownOption } from './shell/Dropdown';
import { Chip } from './shell/Chip';
import { Link } from './shell/Link';
import { Alert } from './shell/Alert';
import { Button } from './shell/Button';

type CreationPath = 'new' | 'copy' | 'template';

const STATUS_OPTIONS: DropdownOption[] = [
  { value: 'Preliminary', label: 'Preliminary' },
  { value: 'Active', label: 'Active' },
  { value: 'Hold', label: 'Hold' },
  { value: 'Work Hold', label: 'Work Hold' },
  { value: 'Billing Hold', label: 'Billing Hold' },
  { value: 'Closed', label: 'Closed' },
];

const BILLING_TYPES = [
  'Time & Expense',
  'Fixed Fee',
  'Percent Complete',
  'Unit Price',
  'Percent of Construction Cost',
  'NonBillable',
  'Marketing',
  'Overhead',
];

const BILLABLE_TYPES = new Set(BILLING_TYPES.slice(0, 5));
const NON_CLIENT_TYPES = new Set(['NonBillable', 'Marketing', 'Overhead']);

const MOCK_CLIENTS: DropdownOption[] = [
  { value: 'c1', label: 'Acme Corp' },
  { value: 'c2', label: 'Brookside Dev' },
  { value: 'c3', label: 'Harbor View LLC' },
];

const MOCK_TEMPLATES: DropdownOption[] = [
  { value: 'ae', label: 'A&E Template — AIA Standard Phases' },
  { value: 'construction', label: 'Construction Template' },
];

const MOCK_PROJECTS: DropdownOption[] = [
  { value: 'p1', label: 'Harbor View (PRJ-2025-001)' },
  { value: 'p2', label: 'Riverside Plaza (PRJ-2025-002)' },
];

const MOCK_RATE_TABLES: DropdownOption[] = [
  { value: 'rt1', label: 'Standard Rates' },
  { value: 'rt2', label: 'Premium Rates' },
];

const MOCK_USERS: DropdownOption[] = [
  { value: 'u1', label: 'Pam Chen' },
  { value: 'u2', label: 'Jordan Lee' },
  { value: 'u3', label: 'Sam Rivera' },
];

const NO_RATE_TABLES_CONFIGURED = false;
const EXISTING_PROJECT_IDS = ['PRJ-2025-001', 'PRJ-2025-002'];

export interface CreateProjectForm {
  creationPath: CreationPath;
  templateId?: string;
  copyFromProjectId?: string;
  projectName: string;
  projectId: string;
  status: string;
  clientId?: string;
  projectManagerIds: string[];
  billingType: string;
  rateTableId?: string;
}

export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreateProject: (form: CreateProjectForm) => void;
}

const DEFAULT_FORM: CreateProjectForm = {
  creationPath: 'new',
  projectName: '',
  projectId: '',
  status: 'Preliminary',
  projectManagerIds: [],
  billingType: 'Time & Expense',
};

const formGroupStyle = { marginBottom: 'var(--space-4)' };
const sectionGapStyle = { marginBottom: 'var(--space-6)' };

export function CreateProjectModal({
  open,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const [form, setForm] = useState<CreateProjectForm>(DEFAULT_FORM);
  const [errors, setErrors] = useState<{
    projectName?: string;
    projectId?: string;
    client?: string;
    rateTable?: string;
  }>({});

  const showClient = useMemo(
    () => !NON_CLIENT_TYPES.has(form.billingType),
    [form.billingType]
  );
  const showRateTable = useMemo(
    () => form.status === 'Active' && BILLABLE_TYPES.has(form.billingType),
    [form.status, form.billingType]
  );

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.projectName.trim()) next.projectName = 'Project name is required.';
    else if (form.projectName.length > 80) next.projectName = 'Project name must be 80 characters or less.';
    else if (form.projectName.includes('/')) next.projectName = 'Project name cannot contain slashes.';
    if (!form.projectId.trim()) next.projectId = 'Project ID is required.';
    else if (EXISTING_PROJECT_IDS.includes(form.projectId.trim())) next.projectId = 'This Project ID already exists. Choose another.';
    if (showClient && !form.clientId) next.client = 'Client is required for this billing type.';
    if (showRateTable && !form.rateTableId) next.rateTable = 'Rate table is required when status is Active and billing type is billable.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onCreateProject(form);
    handleClose();
  };

  const footer = (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <Button buttonType="theme" variant="primary" onClick={handleSubmit}>
        Create Project
      </Button>
      <Button buttonType="theme" variant="outline" onClick={handleClose}>
        Cancel
      </Button>
    </div>
  );

  const addProjectManager = (id: string) => {
    if (!form.projectManagerIds.includes(id)) {
      setForm((f) => ({ ...f, projectManagerIds: [...f.projectManagerIds, id] }));
    }
  };

  const removeProjectManager = (id: string) => {
    setForm((f) => ({ ...f, projectManagerIds: f.projectManagerIds.filter((x) => x !== id) }));
  };

  return (
    <Dialog
      id="create-project-dialog"
      title="Create Project"
      open={open}
      onClose={handleClose}
      className="dialog--form"
      footer={footer}
    >
      {/* Creation path: three option boxes */}
      <div style={{ ...sectionGapStyle, display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setForm((f) => ({ ...f, creationPath: 'new' }))}
          onKeyDown={(e) => e.key === 'Enter' && setForm((f) => ({ ...f, creationPath: 'new' }))}
          style={{
            flex: '1',
            minWidth: '160px',
            padding: 'var(--space-4)',
            border: `2px solid ${form.creationPath === 'new' ? 'var(--theme-primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            background: form.creationPath === 'new' ? 'var(--theme-primary-light)' : 'var(--card-bg)',
            cursor: 'pointer',
          }}
        >
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-base)', fontWeight: 600 }}>New Project</h3>
          <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Create a project with no phase structure. Add phases later if needed.
          </p>
          <Link href="#">Use Dela</Link>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setForm((f) => ({ ...f, creationPath: 'copy' }))}
          onKeyDown={(e) => e.key === 'Enter' && setForm((f) => ({ ...f, creationPath: 'copy' }))}
          style={{
            flex: '1',
            minWidth: '160px',
            padding: 'var(--space-4)',
            border: `2px solid ${form.creationPath === 'copy' ? 'var(--theme-primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            background: form.creationPath === 'copy' ? 'var(--theme-primary-light)' : 'var(--card-bg)',
            cursor: 'pointer',
          }}
        >
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-base)', fontWeight: 600 }}>Copy Existing</h3>
          <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Duplicate the phase structure from an existing project. Financial data is not copied.
          </p>
          <Link href="#">Use Dela</Link>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setForm((f) => ({ ...f, creationPath: 'template' }))}
          onKeyDown={(e) => e.key === 'Enter' && setForm((f) => ({ ...f, creationPath: 'template' }))}
          style={{
            flex: '1',
            minWidth: '160px',
            padding: 'var(--space-4)',
            border: `2px solid ${form.creationPath === 'template' ? 'var(--theme-primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            background: form.creationPath === 'template' ? 'var(--theme-primary-light)' : 'var(--card-bg)',
            cursor: 'pointer',
          }}
        >
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-base)', fontWeight: 600 }}>From Template</h3>
          <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Apply a template&apos;s phase structure (e.g. A&E or Construction) when the project is created.
          </p>
          <Link href="#">Use Dela</Link>
        </div>
      </div>

      {form.creationPath === 'template' && (
        <div style={formGroupStyle}>
          <Dropdown
            label="Template"
            labelVariant="stacked"
            options={MOCK_TEMPLATES}
            value={form.templateId ?? ''}
            placeholder="Select a template"
            onChange={(value) => setForm((f) => ({ ...f, templateId: value }))}
          />
        </div>
      )}
      {form.creationPath === 'copy' && (
        <div style={formGroupStyle}>
          <Dropdown
            label="Copy from project"
            labelVariant="stacked"
            options={MOCK_PROJECTS}
            value={form.copyFromProjectId ?? ''}
            placeholder="Select a project"
            onChange={(value) => setForm((f) => ({ ...f, copyFromProjectId: value }))}
          />
        </div>
      )}

      {/* Project Name (full width), then Project ID / Number + Status (inline row) */}
      <div style={sectionGapStyle}>
        <div style={formGroupStyle}>
          <Input
            label="Project Name"
            labelVariant="stacked"
            required
            maxLength={81}
            value={form.projectName}
            onChange={(e) => setForm((f) => ({ ...f, projectName: e.target.value }))}
            error={Boolean(errors.projectName)}
            errorMessage={errors.projectName}
            placeholder="Enter project name"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div style={{ minWidth: 0, width: '100%' }}>
            <Input
              label="Project ID / Number"
              labelVariant="stacked"
              required
              value={form.projectId}
              onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
              error={Boolean(errors.projectId)}
              errorMessage={errors.projectId}
              placeholder="Enter or auto-generated"
            />
          </div>
          <div style={{ minWidth: 0, width: '100%' }}>
            <Dropdown
              label="Status"
              labelVariant="stacked"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(value) => setForm((f) => ({ ...f, status: value }))}
              className="dropdown--full-width"
            />
          </div>
        </div>
      </div>

      {/* Client (conditional) – full width */}
      {showClient && (
        <div style={{ ...sectionGapStyle, ...formGroupStyle, width: '100%' }}>
          <div style={{ width: '100%' }}>
            <Dropdown
              label="Client"
              labelVariant="stacked"
              options={MOCK_CLIENTS}
              value={form.clientId ?? ''}
              placeholder="Select client"
              onChange={(value) => setForm((f) => ({ ...f, clientId: value }))}
              className="dropdown--full-width"
            />
          </div>
          {errors.client && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error)', marginTop: 'var(--space-1)' }}>
              {errors.client}
            </p>
          )}
        </div>
      )}

      {/* Project Manager(s) – multi-select with pills, full width */}
      <div style={{ ...sectionGapStyle, width: '100%' }}>
        <div style={{ ...formGroupStyle, width: '100%' }}>
          <label className="label" style={{ display: 'block', marginBottom: 'var(--space-1-5)' }}>
            Project Manager(s)
          </label>
          <div style={{ width: '100%' }}>
            <Dropdown
              placeholder="Add project manager"
              options={MOCK_USERS.filter((u) => !form.projectManagerIds.includes(u.value))}
              value=""
              onChange={(value) => addProjectManager(value)}
              className="dropdown--full-width"
            />
          </div>
          {form.projectManagerIds.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {form.projectManagerIds.map((id) => {
                const user = MOCK_USERS.find((u) => u.value === id);
                return (
                  <Chip
                    key={id}
                    label={user?.label ?? id}
                    removable
                    onRemove={() => removeProjectManager(id)}
                    size="md"
                    variant="outline"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Billing type – 4 chips per row, 2 rows */}
      <div style={sectionGapStyle}>
        <div style={formGroupStyle}>
          <label className="label" style={{ display: 'block', marginBottom: 'var(--space-1-5)' }}>
            Billing type
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-2)',
            }}
          >
            {BILLING_TYPES.map((billingType) => (
              <Chip
                key={billingType}
                label={billingType}
                selected={form.billingType === billingType}
                onClick={() => setForm((f) => ({ ...f, billingType }))}
                size="md"
                variant="outline"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Rate Table (conditional) + warning */}
      {showRateTable && (
        <div style={sectionGapStyle}>
          {NO_RATE_TABLES_CONFIGURED ? (
            <div style={formGroupStyle}>
              <Alert
                variant="warning"
                style="enhanced"
                title="Rate table required"
                linkText="Set up Rate Tables"
                linkHref="#"
              >
                No rate tables are configured. Add a rate table before using this project for billing.
              </Alert>
            </div>
          ) : (
            <div style={formGroupStyle}>
              <Dropdown
                label="Rate Table"
                labelVariant="stacked"
                options={MOCK_RATE_TABLES}
                value={form.rateTableId ?? ''}
                placeholder="Select rate table"
                onChange={(value) => setForm((f) => ({ ...f, rateTableId: value }))}
              />
              {errors.rateTable && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error)', marginTop: 'var(--space-1)' }}>
                  {errors.rateTable}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
