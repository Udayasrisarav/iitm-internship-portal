export type Role = 'applicant' | 'supervisor' | 'chairman' | 'admin';

export type Gender = 'male' | 'female' | 'other';

// Ordered lifecycle statuses — each represents a step in the single
// Internship Application workflow. Roles interact with the same record
// at different points along this lifecycle.
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'schedule_selected'
  | 'security_submitted'
  | 'bank_docs_submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'internship_active'
  | 'in_progress'
  | 'completed'
  | 'certificates_generated'
  | 'awaiting_chairman'
  | 'signed'
  | 'closed';

export type WorkflowStageId =
  | 'application_form'
  | 'schedule_selection'
  | 'security_form'
  | 'bank_documents'
  | 'review_submit'
  | 'verification'
  | 'internship_progress'
  | 'completion'
  | 'certificates'
  | 'chairman_signature'
  | 'closed';

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
  duration?: string;
}

export type SignatureRole = 'applicant' | 'chief_security_officer' | 'chairman';

export interface SignatureState {
  applicant?: { signedAt: string; signedBy: string };
  chiefSecurityOfficer?: { signedAt: string; signedBy: string };
  chairman?: { signedAt: string; signedBy: string };
}

export type CertificateKind =
  | 'internship_certificate'
  | 'attendance_certificate'
  | 'internship_report';

export interface CertificateRecord {
  kind: CertificateKind;
  title: string;
  generatedAt?: string;
  signed?: boolean;
  signedAt?: string;
  signedBy?: string;
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
  securitySignatures?: SignatureState;
  certificates?: CertificateRecord[];
  chairmanSigned?: boolean;
  locked?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}
