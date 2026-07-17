export type Role = 'applicant' | 'supervisor' | 'chairman' | 'admin';

export type Gender = 'male' | 'female' | 'other';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'in_progress'
  | 'completed';

export type WorkflowStageId =
  | 'application_form'
  | 'schedule_selection'
  | 'security_form'
  | 'bank_documents'
  | 'review_submit'
  | 'verification'
  | 'internship_progress'
  | 'completion';

export type DocumentKey =
  | 'aadhaar'
  | 'photo'
  | 'passbook'
  | 'bonafide'
  | 'college_id';

export type IDType = 'aadhaar' | 'passport' | 'voter_id' | 'driving_license' | 'pan';

export type ActivityStatus = 'in_progress' | 'completed';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'holiday';

export type VerificationAction = 'approved' | 'rejected' | 'remark';

export interface PersonalInfo {
  fullName: string;
  email: string;
  mobile: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
}

export interface AcademicInfo {
  collegeName: string;
  department: string;
  registerNumber: string;
  yearOfStudy: string;
  skills: string;
  areaOfInterest: string;
}

export interface ScheduleSelection {
  department: string;
  professor: string;
  batch: string;
  startDate: string;
  endDate: string;
}

export interface SecurityForm {
  studentName: string;
  fatherName: string;
  collegeName: string;
  presentAddress: string;
  contactNumber: string;
  idType: IDType;
  idNumber: string;
  departmentIITM: string;
  professorInCharge: string;
  durationFrom: string;
  durationTo: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface DocumentFile {
  key: DocumentKey;
  label: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  previewUrl?: string;
}

export interface VerificationEntry {
  id: string;
  action: VerificationAction;
  actorName: string;
  actorRole: Role;
  remarks: string;
  timestamp: string;
}

export interface ActivityEntry {
  id: string;
  date: string;
  taskTitle: string;
  workDescription: string;
  status: ActivityStatus;
  reportLink?: string;
  reportFileName?: string;
}

export interface AttendanceEntry {
  id: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

export interface WorkflowStage {
  id: WorkflowStageId;
  label: string;
  description: string;
  status: 'pending' | 'current' | 'done';
  completedAt?: string;
}

export interface InternshipApplication {
  id: string;
  applicantId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  personal: PersonalInfo;
  academic: AcademicInfo;
  schedule: ScheduleSelection;
  security: SecurityForm;
  bank: BankDetails;
  documents: DocumentFile[];
  verification: VerificationEntry[];
  activities: ActivityEntry[];
  attendance: AttendanceEntry[];
  workflow: WorkflowStage[];
  currentStage: WorkflowStageId;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}
