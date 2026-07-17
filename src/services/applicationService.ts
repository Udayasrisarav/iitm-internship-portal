import type {
  ActivityEntry,
  ApplicationStatus,
  DocumentFile,
  InternshipApplication,
  VerificationAction,
  VerificationEntry,
  WorkflowStageId,
} from '../types';
import {
  buildWorkflow,
  mockApplications,
  mockScheduleOptions,
  type ScheduleOption,
} from '../mock-data/applications';

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const applicationService = {
  async list(): Promise<InternshipApplication[]> {
    await delay();
    return clone(mockApplications);
  },

  async getById(id: string): Promise<InternshipApplication | undefined> {
    await delay();
    const found = mockApplications.find((a) => a.id === id || a.applicantId === id);
    return found ? clone(found) : undefined;
  },

  async getByApplicantId(applicantId: string): Promise<InternshipApplication | undefined> {
    await delay();
    const found = mockApplications.find((a) => a.applicantId === applicantId);
    return found ? clone(found) : undefined;
  },

  async updateApplication(
    id: string,
    patch: Partial<InternshipApplication>,
  ): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    Object.assign(app, patch, { updatedAt: new Date().toISOString() });
    return clone(app);
  },

  async updateWorkflowStage(
    id: string,
    stage: WorkflowStageId,
    submitted: boolean,
  ): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.currentStage = stage;
    app.workflow = buildWorkflow(stage, submitted);
    app.updatedAt = new Date().toISOString();
    return clone(app);
  },

  async submitForVerification(id: string): Promise<InternshipApplication> {
    await delay(700);
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.status = 'submitted';
    app.submittedAt = new Date().toISOString();
    app.currentStage = 'verification';
    app.workflow = buildWorkflow('verification', true);
    app.updatedAt = new Date().toISOString();
    return clone(app);
  },

  async setStatus(id: string, status: ApplicationStatus): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.status = status;
    app.updatedAt = new Date().toISOString();
    if (status === 'approved' || status === 'in_progress') {
      app.currentStage = 'internship_progress';
      app.workflow = buildWorkflow('internship_progress', true);
    }
    return clone(app);
  },

  async addVerification(
    id: string,
    entry: Omit<VerificationEntry, 'id' | 'timestamp'>,
  ): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    const newEntry: VerificationEntry = {
      ...entry,
      id: `v-${app.verification.length + 1}`,
      timestamp: new Date().toISOString(),
    };
    app.verification = [newEntry, ...app.verification];
    if (entry.action === 'approved') app.status = 'approved';
    if (entry.action === 'rejected') app.status = 'rejected';
    app.updatedAt = new Date().toISOString();
    return clone(app);
  },

  async uploadDocument(id: string, file: DocumentFile): Promise<InternshipApplication> {
    await delay(900);
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    const idx = app.documents.findIndex((d) => d.key === file.key);
    if (idx >= 0) app.documents[idx] = file;
    else app.documents.push(file);
    app.updatedAt = new Date().toISOString();
    return clone(app);
  },

  async addActivity(id: string, activity: Omit<ActivityEntry, 'id'>): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.activities = [
      { ...activity, id: `act-${app.activities.length + 1}` },
      ...app.activities,
    ];
    app.updatedAt = new Date().toISOString();
    return clone(app);
  },
};

export const scheduleService = {
  async listOptions(): Promise<ScheduleOption[]> {
    await delay();
    return clone(mockScheduleOptions);
  },
};

export type { ScheduleOption };
export type { VerificationAction };
