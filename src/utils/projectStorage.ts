/**
 * Persist projects list and selected project ID to localStorage so the projects
 * table and detail view survive reloads and HMR.
 */

import type { Project } from '../types/project';

const PROJECTS_KEY = 'startpoint_projects';
const SELECTED_PROJECT_ID_KEY = 'startpoint_selected_project_id';

function isProjectLike(item: unknown): item is Project {
  return (
    item != null &&
    typeof item === 'object' &&
    'projectId' in item &&
    typeof (item as Project).projectId === 'string' &&
    ((item as Project).projectId as string).trim() !== ''
  );
}

export function readProjectsFromStorage(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isProjectLike) as Project[];
  } catch {
    return [];
  }
}

export function writeProjectsToStorage(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // ignore
  }
}

export function readSelectedProjectId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const id = localStorage.getItem(SELECTED_PROJECT_ID_KEY);
    return id != null && id !== '' ? id : null;
  } catch {
    return null;
  }
}

export function writeSelectedProjectId(id: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (id != null && id !== '') {
      localStorage.setItem(SELECTED_PROJECT_ID_KEY, id);
    } else {
      localStorage.removeItem(SELECTED_PROJECT_ID_KEY);
    }
  } catch {
    // ignore
  }
}
