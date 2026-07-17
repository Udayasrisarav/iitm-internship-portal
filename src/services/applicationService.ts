import type {
  ActivityEntry,
  ApplicationStatus,
  CertificateRecord,
  DocumentFile,
  InternshipApplication,
  SignatureRole,
  VerificationAction,
  VerificationEntry,
  WorkflowStageId,
} from '../types';
import {
  buildWorkflow,
  generateApplicantId,
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
    app.status = 'under_review';
    app.submittedAt = new Date().toISOString();
    app.currentStage = 'verification';
    app.workflow = buildWorkflow('verification', true);
    app.locked = true;
    app.updatedAt = new Date().toISOString();
    return clone(app);
  },

  async setStatus(id: string, status: ApplicationStatus, stage?: WorkflowStageId): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.status = status;
    app.updatedAt = new Date().toISOString();
    if (stage) {
      app.currentStage = stage;
      app.workflow = buildWorkflow(stage, true);
    } else if (status === 'approved') {
      app.currentStage = 'internship_progress';
      app.workflow = buildWorkflow('internship_progress', true);
    } else if (status === 'rejected') {
      app.currentStage = 'verification';
      app.workflow = buildWorkflow('verification', true);
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
    if (entry.action === 'approved') {
      app.status = 'approved';
      app.currentStage = 'internship_progress';
      app.workflow = buildWorkflow('internship_progress', true);
    }
    if (entry.action === 'rejected') {
      app.status = 'rejected';
    }
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

  async createDraft(personal: Partial<InternshipApplication['personal']>): Promise<InternshipApplication> {
    await delay();
    const applicantId = generateApplicantId(mockApplications);
    const newApp: InternshipApplication = {
      id: `app-${Date.now()}`,
      applicantId,
      status: 'draft',
      submittedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personal: {
        fullName: personal.fullName ?? '',
        email: personal.email ?? '',
        mobile: personal.mobile ?? '',
        gender: personal.gender ?? 'male',
        dateOfBirth: personal.dateOfBirth ?? '',
        address: personal.address ?? '',
      },
      academic: {
        collegeName: '', department: '', registerNumber: '',
        yearOfStudy: '', skills: '', areaOfInterest: '',
      },
      schedule: { department: '', professor: '', batch: '', startDate: '', endDate: '', duration: '' },
      security: {
        studentName: personal.fullName ?? '', fatherName: '', collegeName: '',
        presentAddress: personal.address ?? '', contactNumber: personal.mobile ?? '',
        idType: 'aadhaar', idNumber: '', departmentIITM: '', professorInCharge: '',
        durationFrom: '', durationTo: '',
      },
      bank: { accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', branchName: '' },
      documents: [], verification: [], activities: [], attendance: [],
      workflow: buildWorkflow('application_form', false),
      currentStage: 'application_form',
      securitySignatures: {}, certificates: [], chairmanSigned: false, locked: false,
    };
    mockApplications.push(newApp);
    return clone(newApp);
  },

  async signSecurity(id: string, role: SignatureRole, signedBy: string): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.securitySignatures = app.securitySignatures ?? {};
    if (role === 'applicant') app.securitySignatures.applicant = { signedAt: new Date().toISOString(), signedBy };
    if (role === 'chief_security_officer') app.securitySignatures.chiefSecurityOfficer = { signedAt: new Date().toISOString(), signedBy };
    if (role === 'chairman') app.securitySignatures.chairman = { signedAt: new Date().toISOString(), signedBy };
    app.updatedAt = new Date().toISOString();
    return clone(app);
  },

  async advanceToStage(id: string, status: ApplicationStatus, stage: WorkflowStageId): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.status = status;
    app.currentStage = stage;
    app.workflow = buildWorkflow(stage, true);
    app.updatedAt = new Date().toISOString();
    if (stage === 'certificates') {
      app.certificates = [
        { kind: 'internship_certificate', title: 'Internship Certificate', generatedAt: new Date().toISOString() },
        { kind: 'attendance_certificate', title: 'Attendance Certificate', generatedAt: new Date().toISOString() },
        { kind: 'internship_report', title: 'Internship Report', generatedAt: new Date().toISOString() },
      ];
    }
    return clone(app);
  },

  async signChairman(id: string, signedBy: string): Promise<InternshipApplication> {
    await delay();
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');
    app.chairmanSigned = true;
    app.securitySignatures = app.securitySignatures ?? {};
    app.securitySignatures.chairman = { signedAt: new Date().toISOString(), signedBy };
    app.status = 'signed';
    app.currentStage = 'closed';
    app.workflow = buildWorkflow('closed', true);
    app.certificates = (app.certificates ?? []).map((c) => ({ ...c, signed: true, signedAt: new Date().toISOString(), signedBy }));
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
