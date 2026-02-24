/**
 * Project detail view – ShellPageHeader + section Cards (Overview, People, Financial, Schedule, Configuration).
 * Full spec fields in a multi-column layout. Read-only by default; Edit mode for adding/editing deferred data.
 */

import { useState, useEffect } from 'react';
import { ShellPageHeader } from './shell/ShellPageHeader';
import { Card } from './shell/Card';
import { Input } from './shell/Input';
import { Dropdown, type DropdownOption } from './shell/Dropdown';
import { Chip } from './shell/Chip';
import type { Project } from '../types/project';
import {
  isBillableBillingType,
  isClientRequiredBillingType,
  isConstructionCostBillingType,
} from '../types/project';
import { Button } from './shell/Button';
import './ProjectDetailView.css';

/** Same AI icon as Create Project modal Dela banner (purple, Dela-branded). */
const DelaBannerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="project-detail__dela-banner-icon"
    aria-hidden
  >
    <path d="M8 16v-6a2 2 0 1 1 4 0v6" />
    <path d="M8 13h4" />
    <path d="M16 8v8" />
  </svg>
);

/** Status-based banner messages for the detail page (contextual implication + optional action). */
const DETAIL_STATUS_BANNERS: Record<
  string,
  { message: string; actionLabel?: string }
> = {
  Preliminary: {
    message:
      'This project is in Preliminary status. Team members won\'t see it in their timesheet until you set it to Active.',
    actionLabel: 'Set to Active',
  },
  Hold: {
    message: 'Time entry is blocked; invoicing is still allowed.',
  },
  'Work Hold': {
    message: 'Time entry is blocked; invoicing is still allowed.',
  },
  'Billing Hold': {
    message: 'Time entry is allowed; invoicing is blocked.',
  },
  Closed: {
    message: 'Closed projects are read-only. No further time entry or invoicing.',
  },
};

const MOCK_USERS: DropdownOption[] = [
  { value: 'u1', label: 'Pam Chen' },
  { value: 'u2', label: 'Jordan Lee' },
  { value: 'u3', label: 'Sam Rivera' },
];

const STATUS_OPTIONS: DropdownOption[] = [
  { value: 'Preliminary', label: 'Preliminary' },
  { value: 'Active', label: 'Active' },
  { value: 'Hold', label: 'Hold' },
  { value: 'Work Hold', label: 'Work Hold' },
  { value: 'Billing Hold', label: 'Billing Hold' },
  { value: 'Closed', label: 'Closed' },
];

const MOCK_CLIENTS: DropdownOption[] = [
  { value: 'c1', label: 'Acme Corp' },
  { value: 'c2', label: 'Brookside Dev' },
  { value: 'c3', label: 'Harbor View LLC' },
];

const BILLING_TYPE_OPTIONS: DropdownOption[] = [
  { value: 'Time & Expense', label: 'Time & Expense' },
  { value: 'Fixed Fee', label: 'Fixed Fee' },
  { value: 'Percent Complete', label: 'Percent Complete' },
  { value: 'Unit Price', label: 'Unit Price' },
  { value: 'Percent of Construction Cost', label: 'Percent of Construction Cost' },
  { value: 'NonBillable', label: 'NonBillable' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Overhead', label: 'Overhead' },
];

const MOCK_RATE_TABLES: DropdownOption[] = [
  { value: 'rt1', label: 'Standard Rates' },
  { value: 'rt2', label: 'Premium Rates' },
];

const REVENUE_METHOD_OPTIONS: DropdownOption[] = [
  { value: 'Billed + WIP', label: 'Billed + WIP' },
  { value: 'Billed', label: 'Billed' },
];

export interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onProjectUpdate?: (project: Project, originalProjectId?: string) => void;
}

function DetailField({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string | undefined | null;
  fullWidth?: boolean;
}) {
  const display = value != null && String(value).trim() !== '' ? String(value) : '—';
  return (
    <div
      className={`project-detail__field${fullWidth ? ' project-detail__card-grid--full' : ''}`}
    >
      <div className="project-detail__field-label">{label}</div>
      <div className="project-detail__field-value">{display}</div>
    </div>
  );
}

const fullWidthStyle = { gridColumn: '1 / -1' as const };

export function ProjectDetailView({ project, onBack, onProjectUpdate }: ProjectDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState<Project>(project);

  useEffect(() => {
    if (!isEditing) setEdit(project);
  }, [project, isEditing]);

  const showClient = isClientRequiredBillingType(edit.billingType);
  const showRateTable = isBillableBillingType(edit.billingType);
  const showConstructionCost = isConstructionCostBillingType(edit.billingType);

  const handleSave = () => {
    onProjectUpdate?.(edit, project.projectId);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEdit(project);
    setIsEditing(false);
  };

  const addTeamMember = (id: string) => {
    if (!edit.teamMemberIds.includes(id)) {
      setEdit((e) => ({ ...e, teamMemberIds: [...e.teamMemberIds, id] }));
    }
  };

  const removeTeamMember = (id: string) => {
    setEdit((e) => ({ ...e, teamMemberIds: e.teamMemberIds.filter((x) => x !== id) }));
  };

  const headerActions = isEditing
    ? {
        outlineButton1: { text: 'Cancel', onClick: handleCancel },
        primaryButton: { text: 'Save', onClick: handleSave },
      }
    : {
        outlineButton1: { text: 'Back to Projects', onClick: onBack },
        primaryButton: onProjectUpdate ? { text: 'Edit', onClick: () => setIsEditing(true) } : undefined,
      };

  return (
    <div className="project-detail">
      <ShellPageHeader
        title={edit.projectName || 'Untitled Project'}
        subtitle={edit.projectId ? `Project ID: ${edit.projectId}` : undefined}
        showDefaultButtons={false}
        {...headerActions}
      />

      {/* Overview */}
      <Card primary elevated withHeader headerTitle="Overview" headerSubtitle="">
        {DETAIL_STATUS_BANNERS[edit.status] && (
          <div className="project-detail__status-banner-wrap">
            <div className="project-detail__dela-banner" role="status">
              <DelaBannerIcon />
              <span>{DETAIL_STATUS_BANNERS[edit.status].message}</span>
            </div>
            {DETAIL_STATUS_BANNERS[edit.status].actionLabel === 'Set to Active' &&
              onProjectUpdate && (
                <Button
                  buttonType="theme"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEdit((e) => ({ ...e, status: 'Active' }));
                    setIsEditing(true);
                  }}
                >
                  Set to Active
                </Button>
              )}
          </div>
        )}
        <div className="card__body project-detail__card-grid">
          {!isEditing ? (
            <>
              <DetailField label="Project name" value={edit.projectName} fullWidth />
              <DetailField label="Project ID" value={edit.projectId} />
              <DetailField label="Status" value={edit.status} />
              {showClient && <DetailField label="Client" value={edit.clientId} />}
              <DetailField label="Billing type" value={edit.billingType} />
              {showRateTable && <DetailField label="Rate table" value={edit.rateTableId} />}
            </>
          ) : (
            <>
              <div className="project-detail__field project-detail__card-grid--full" style={fullWidthStyle}>
                <Input
                  label="Project name"
                  labelVariant="stacked"
                  value={edit.projectName}
                  onChange={(e) => setEdit((p) => ({ ...p, projectName: e.target.value }))}
                  placeholder="—"
                  maxLength={80}
                />
              </div>
              <div className="project-detail__field">
                <Input
                  label="Project ID / Number"
                  labelVariant="stacked"
                  value={edit.projectId}
                  onChange={(e) => setEdit((p) => ({ ...p, projectId: e.target.value }))}
                  placeholder="—"
                />
              </div>
              <div className="project-detail__field">
                <Dropdown
                  label="Status"
                  labelVariant="stacked"
                  options={STATUS_OPTIONS}
                  value={edit.status}
                  onChange={(v) => setEdit((p) => ({ ...p, status: v }))}
                  className="dropdown--full-width"
                />
              </div>
              {showClient && (
                <div className="project-detail__field">
                  <Dropdown
                    label="Client"
                    labelVariant="stacked"
                    options={MOCK_CLIENTS}
                    value={edit.clientId ?? ''}
                    placeholder="Select client"
                    onChange={(v) => setEdit((p) => ({ ...p, clientId: v || undefined }))}
                    className="dropdown--full-width"
                  />
                </div>
              )}
              <div className="project-detail__field">
                <Dropdown
                  label="Billing type"
                  labelVariant="stacked"
                  options={BILLING_TYPE_OPTIONS}
                  value={edit.billingType}
                  onChange={(v) => setEdit((p) => ({ ...p, billingType: v }))}
                  className="dropdown--full-width"
                />
              </div>
              {showRateTable && (
                <div className="project-detail__field">
                  <Dropdown
                    label="Rate table"
                    labelVariant="stacked"
                    options={MOCK_RATE_TABLES}
                    value={edit.rateTableId ?? ''}
                    placeholder="Select rate table"
                    onChange={(v) => setEdit((p) => ({ ...p, rateTableId: v || undefined }))}
                    className="dropdown--full-width"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* People */}
      <Card primary elevated withHeader headerTitle="People" headerSubtitle="">
        <div className="card__body project-detail__card-grid">
          {!isEditing ? (
            <>
              <DetailField
                label="Project manager(s)"
                value={
                  edit.projectManagerIds.length > 0
                    ? edit.projectManagerIds.join(', ')
                    : undefined
                }
              />
              <DetailField label="Principal in charge" value={edit.principalInChargeId} />
              <DetailField
                label="Team members"
                value={
                  edit.teamMemberIds.length > 0 ? edit.teamMemberIds.join(', ') : undefined
                }
                fullWidth
              />
            </>
          ) : (
            <>
              <DetailField
                label="Project manager(s)"
                value={
                  edit.projectManagerIds.length > 0
                    ? edit.projectManagerIds.join(', ')
                    : undefined
                }
              />
              <div className="project-detail__field">
                <div className="project-detail__field-label">Principal in charge</div>
                <Dropdown
                  options={MOCK_USERS}
                  value={edit.principalInChargeId ?? ''}
                  placeholder="Select"
                  onChange={(v) => setEdit((e) => ({ ...e, principalInChargeId: v || undefined }))}
                  className="dropdown--full-width"
                />
              </div>
              <div className="project-detail__field project-detail__card-grid--full" style={fullWidthStyle}>
                <div className="project-detail__field-label">Team members</div>
                <Dropdown
                  placeholder="Add team member"
                  options={MOCK_USERS.filter((u) => !edit.teamMemberIds.includes(u.value))}
                  value=""
                  onChange={(v) => v && addTeamMember(v)}
                  className="dropdown--full-width"
                />
                {edit.teamMemberIds.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                    {edit.teamMemberIds.map((id) => {
                      const user = MOCK_USERS.find((u) => u.value === id);
                      return (
                        <Chip
                          key={id}
                          label={user?.label ?? id}
                          removable
                          onRemove={() => removeTeamMember(id)}
                          size="md"
                          variant="outline"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Financial */}
      <Card primary elevated withHeader headerTitle="Financial" headerSubtitle="">
        <div className="card__body project-detail__card-grid">
          {!isEditing ? (
            <>
              <DetailField label="Revenue method" value={edit.revenueMethod} />
              <DetailField label="Invoice format" value={edit.invoiceFormat} />
              <DetailField label="Contract amount" value={edit.contractAmount} />
              {showConstructionCost && (
                <DetailField label="Construction cost" value={edit.constructionCost} />
              )}
              <DetailField label="Budget (labor)" value={edit.budgetLabor} />
              <DetailField label="Budget (expense)" value={edit.budgetExpense} />
              <DetailField label="Budget (consultant)" value={edit.budgetConsultant} />
              {edit.percentCompleteConfig != null && (
                <DetailField
                  label="Percent complete config"
                  value={edit.percentCompleteConfig}
                  fullWidth
                />
              )}
            </>
          ) : (
            <>
              <div className="project-detail__field">
                <Dropdown
                  label="Revenue method"
                  labelVariant="stacked"
                  options={REVENUE_METHOD_OPTIONS}
                  value={edit.revenueMethod}
                  onChange={(v) => setEdit((e) => ({ ...e, revenueMethod: v }))}
                  className="dropdown--full-width"
                />
              </div>
              <div className="project-detail__field">
                <Input
                  label="Invoice format"
                  labelVariant="stacked"
                  value={edit.invoiceFormat ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, invoiceFormat: e.target.value || undefined }))
                  }
                  placeholder="—"
                />
              </div>
              <div className="project-detail__field">
                <Input
                  label="Contract amount"
                  labelVariant="stacked"
                  value={edit.contractAmount ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, contractAmount: e.target.value || undefined }))
                  }
                  placeholder="—"
                />
              </div>
              {showConstructionCost && (
                <div className="project-detail__field">
                  <Input
                    label="Construction cost"
                    labelVariant="stacked"
                    value={edit.constructionCost ?? ''}
                    onChange={(e) =>
                      setEdit((p) => ({ ...p, constructionCost: e.target.value || undefined }))
                    }
                    placeholder="—"
                  />
                </div>
              )}
              <div className="project-detail__field">
                <Input
                  label="Budget (labor)"
                  labelVariant="stacked"
                  value={edit.budgetLabor ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, budgetLabor: e.target.value || undefined }))
                  }
                  placeholder="—"
                />
              </div>
              <div className="project-detail__field">
                <Input
                  label="Budget (expense)"
                  labelVariant="stacked"
                  value={edit.budgetExpense ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, budgetExpense: e.target.value || undefined }))
                  }
                  placeholder="—"
                />
              </div>
              <div className="project-detail__field">
                <Input
                  label="Budget (consultant)"
                  labelVariant="stacked"
                  value={edit.budgetConsultant ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, budgetConsultant: e.target.value || undefined }))
                  }
                  placeholder="—"
                />
              </div>
              <div className="project-detail__field project-detail__card-grid--full" style={fullWidthStyle}>
                <Input
                  label="Percent complete config"
                  labelVariant="stacked"
                  value={edit.percentCompleteConfig ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, percentCompleteConfig: e.target.value || undefined }))
                  }
                  placeholder="—"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Schedule */}
      <Card primary elevated withHeader headerTitle="Schedule" headerSubtitle="">
        <div className="card__body project-detail__card-grid">
          {!isEditing ? (
            <>
              <DetailField label="Start date" value={edit.startDate} />
              <DetailField label="End date" value={edit.endDate} />
            </>
          ) : (
            <>
              <div className="project-detail__field">
                <Input
                  label="Start date"
                  labelVariant="stacked"
                  type="date"
                  value={edit.startDate ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, startDate: e.target.value || undefined }))
                  }
                />
              </div>
              <div className="project-detail__field">
                <Input
                  label="End date"
                  labelVariant="stacked"
                  type="date"
                  value={edit.endDate ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, endDate: e.target.value || undefined }))
                  }
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Configuration */}
      <Card primary elevated withHeader headerTitle="Configuration" headerSubtitle="">
        <div className="card__body project-detail__card-grid">
          {!isEditing ? (
            <>
              <DetailField label="Department" value={edit.department} />
              <div
                className="project-detail__field project-detail__card-grid--full"
                style={fullWidthStyle}
              >
                <div className="project-detail__field-label">Phases</div>
                {edit.phases.length > 0 ? (
                  <ul className="project-detail__phases-list">
                    {edit.phases.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="project-detail__field-value">—</div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="project-detail__field">
                <Input
                  label="Department"
                  labelVariant="stacked"
                  value={edit.department ?? ''}
                  onChange={(e) =>
                    setEdit((p) => ({ ...p, department: e.target.value || undefined }))
                  }
                  placeholder="—"
                />
              </div>
              <div
                className="project-detail__field project-detail__card-grid--full"
                style={fullWidthStyle}
              >
                <div className="project-detail__field-label">Phases</div>
                {edit.phases.length > 0 ? (
                  <ul className="project-detail__phases-list">
                    {edit.phases.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="project-detail__field-value">—</div>
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
