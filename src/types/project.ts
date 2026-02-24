/**
 * Full project type per spec: creation fields + deferred post-creation fields.
 */

import type { CreateProjectForm } from '../components/CreateProjectModal';

export type CreationPath = 'new' | 'copy' | 'template';

const BILLABLE_TYPES = new Set([
  'Time & Expense',
  'Fixed Fee',
  'Percent Complete',
  'Unit Price',
  'Percent of Construction Cost',
]);
const NON_CLIENT_TYPES = new Set(['NonBillable', 'Marketing', 'Overhead']);

export interface Project {
  // From creation (CreateProjectForm)
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
  // People (deferred)
  principalInChargeId?: string;
  teamMemberIds: string[];
  // Financial (deferred)
  revenueMethod: string;
  invoiceFormat?: string;
  contractAmount?: string;
  constructionCost?: string;
  budgetLabor?: string;
  budgetExpense?: string;
  budgetConsultant?: string;
  percentCompleteConfig?: string;
  // Dates
  startDate?: string;
  endDate?: string;
  // Configuration
  department?: string;
  phases: string[];
}

export function isBillableBillingType(billingType: string): boolean {
  return BILLABLE_TYPES.has(billingType);
}

export function isClientRequiredBillingType(billingType: string): boolean {
  return !NON_CLIENT_TYPES.has(billingType);
}

export function isConstructionCostBillingType(billingType: string): boolean {
  return billingType === 'Percent of Construction Cost';
}

/** Map create-form payload to full Project with defaults for deferred fields. */
export function projectFromCreateForm(form: CreateProjectForm): Project {
  const today = new Date().toISOString().slice(0, 10);
  const phases: string[] =
    form.creationPath === 'template' && form.templateId
      ? form.templateId === 'ae'
        ? ['Schematic Design (SD)', 'Design Development (DD)', 'Construction Documents (CD)', 'Bidding / Negotiation', 'Construction Administration (CA)']
        : ['Pre-Construction', 'Foundation', 'Structure', 'Envelope', 'MEP Rough-In', 'Finishes', 'Closeout']
      : form.creationPath === 'copy' && form.copyFromProjectId
        ? ['Phase A', 'Phase B', 'Phase C']
        : [];

  return {
    ...form,
    creationPath: form.creationPath as CreationPath,
    teamMemberIds: [],
    revenueMethod: 'Billed + WIP',
    startDate: today,
    phases,
  };
}
