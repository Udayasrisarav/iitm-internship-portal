import type {
  ActivityEntry,
  AttendanceEntry,
  DocumentFile,
  InternshipApplication,
  Role,
  User,
  WorkflowStage,
  WorkflowStageId,
} from '../types';

export const workflowStageDefs: { id: WorkflowStageId; label: string; description: string }[] = [
  { id: 'application_form', label: 'Application Form', description: 'Personal & academic details' },
  { id: 'schedule_selection', label: 'Schedule Selection', description: 'Department, professor & batch' },
  { id: 'security_form', label: 'Security Form', description: 'Security permission for internship' },
  { id: 'bank_documents', label: 'Bank Details & Documents', description: 'Banking & required uploads' },
  { id: 'review_submit', label: 'Review & Submit', description: 'Confirm and submit application' },
  { id: 'verification', label: 'Verification', description: 'Supervisor & chairman verification' },
  { id: 'internship_progress', label: 'Internship Progress', description: 'Activities & attendance' },
  { id: 'completion', label: 'Completion', description: 'Certificate generation' },
];

export function buildWorkflow(current: WorkflowStageId, submitted: boolean): WorkflowStage[] {
  const order = workflowStageDefs.map((d) => d.id);
  const currentIdx = order.indexOf(current);
  return workflowStageDefs.map((d, idx) => {
    if (idx < currentIdx) {
      return { ...d, status: 'done', completedAt: new Date(Date.now() - (currentIdx - idx) * 86400000).toISOString() };
    }
    if (idx === currentIdx) {
      return { ...d, status: submitted ? 'done' : 'current' };
    }
    return { ...d, status: 'pending' };
  });
}

const sampleDocs: DocumentFile[] = [
  {
    key: 'aadhaar',
    label: 'Aadhaar Card',
    fileName: 'aadhaar_xxxx1234.pdf',
    fileSize: 184320,
    mimeType: 'application/pdf',
    uploadedAt: '2025-05-01T09:14:00Z',
  },
  {
    key: 'photo',
    label: 'Passport Photograph',
    fileName: 'photo_applicant.jpg',
    fileSize: 84210,
    mimeType: 'image/jpeg',
    uploadedAt: '2025-05-01T09:15:00Z',
  },
  {
    key: 'passbook',
    label: 'Bank Passbook',
    fileName: 'passbook_sbi.pdf',
    fileSize: 220540,
    mimeType: 'application/pdf',
    uploadedAt: '2025-05-01T09:16:00Z',
  },
];

const activities: ActivityEntry[] = [
  {
    id: 'act-1',
    date: '2025-06-02',
    taskTitle: 'Literature survey on transformer architectures',
    workDescription:
      'Reviewed 12 recent papers on efficient attention mechanisms and summarised key trade-offs between compute and accuracy.',
    status: 'completed',
    reportLink: 'https://example.edu/reports/lit-survey.pdf',
    reportFileName: 'lit_survey.pdf',
  },
  {
    id: 'act-2',
    date: '2025-06-09',
    taskTitle: 'Dataset preparation & cleaning',
    workDescription: 'Curated 4,200 samples, normalized labels, removed duplicates, and split into train/val/test sets.',
    status: 'completed',
  },
  {
    id: 'act-3',
    date: '2025-06-16',
    taskTitle: 'Baseline model training',
    workDescription: 'Trained a small transformer baseline; tracking loss curves and preparing experiment log.',
    status: 'in_progress',
  },
];

const attendance: AttendanceEntry[] = Array.from({ length: 30 }).map((_, i) => {
  const day = i + 1;
  const weekday = new Date(2025, 5, day).getDay();
  let status: AttendanceEntry['status'] = 'present';
  if (weekday === 0 || weekday === 6) status = 'holiday';
  if (day === 12) status = 'leave';
  if (day === 18) status = 'absent';
  return {
    id: `att-${day}`,
    date: `2025-06-${String(day).padStart(2, '0')}`,
    status,
    checkIn: status === 'present' ? '09:05' : undefined,
    checkOut: status === 'present' ? '17:30' : undefined,
  };
});

export const mockApplications: InternshipApplication[] = [
  {
    id: 'app-2025-0001',
    applicantId: 'IITM-INT-1042',
    status: 'submitted',
    createdAt: '2025-05-01T09:00:00Z',
    updatedAt: '2025-05-01T09:20:00Z',
    submittedAt: '2025-05-01T09:20:00Z',
    personal: {
      fullName: 'Ananya Raman',
      email: 'ananya.raman@example.edu',
      mobile: '+91 98765 43210',
      gender: 'female',
      dateOfBirth: '2003-04-12',
      address: '42, Green Park Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
    },
    academic: {
      collegeName: 'Anna University, CEG Campus',
      department: 'Computer Science & Engineering',
      registerNumber: 'CS21B045',
      yearOfStudy: '3rd Year',
      skills: 'Python, PyTorch, TypeScript, React, SQL',
      areaOfInterest: 'Machine Learning, Natural Language Processing',
    },
    schedule: {
      department: 'Computer Science & Engineering',
      professor: 'Prof. V. Mahesh',
      batch: 'Summer 2025 — Batch A',
      startDate: '2025-06-02',
      endDate: '2025-07-31',
    },
    security: {
      studentName: 'Ananya Raman',
      fatherName: 'Raman Krishnan',
      collegeName: 'Anna University, CEG Campus',
      presentAddress: '42, Green Park Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
      contactNumber: '+91 98765 43210',
      idType: 'aadhaar',
      idNumber: 'XXXX-XXXX-1234',
      departmentIITM: 'Computer Science & Engineering',
      professorInCharge: 'Prof. V. Mahesh',
      durationFrom: '2025-06-02',
      durationTo: '2025-07-31',
    },
    bank: {
      accountHolderName: 'Ananya Raman',
      accountNumber: 'XXXX-XXXX-9087',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India',
      branchName: 'Anna Nagar',
    },
    documents: sampleDocs,
    verification: [
      {
        id: 'v-1',
        action: 'remark',
        actorName: 'Prof. V. Mahesh',
        actorRole: 'supervisor',
        remarks: 'Documents look complete. Please confirm internship duration dates.',
        timestamp: '2025-05-02T11:30:00Z',
      },
    ],
    activities: [],
    attendance: [],
    workflow: buildWorkflow('verification', true),
    currentStage: 'verification',
  },
  {
    id: 'app-2025-0002',
    applicantId: 'IITM-INT-1051',
    status: 'approved',
    createdAt: '2025-04-22T08:00:00Z',
    updatedAt: '2025-04-28T14:00:00Z',
    submittedAt: '2025-04-22T08:40:00Z',
    personal: {
      fullName: 'Rohit Shankar',
      email: 'rohit.shankar@example.edu',
      mobile: '+91 90123 45678',
      gender: 'male',
      dateOfBirth: '2002-11-08',
      address: '7, Lake View Road, Kengeri, Bengaluru, Karnataka 560060',
    },
    academic: {
      collegeName: 'RV College of Engineering',
      department: 'Electronics & Communication',
      registerNumber: 'EC20B112',
      yearOfStudy: '4th Year',
      skills: 'Verilog, MATLAB, C, Embedded C',
      areaOfInterest: 'VLSI Design, Signal Processing',
    },
    schedule: {
      department: 'Electrical Engineering',
      professor: 'Prof. K. Sridhar',
      batch: 'Summer 2025 — Batch B',
      startDate: '2025-05-19',
      endDate: '2025-07-18',
    },
    security: {
      studentName: 'Rohit Shankar',
      fatherName: 'Shankar Iyer',
      collegeName: 'RV College of Engineering',
      presentAddress: '7, Lake View Road, Kengeri, Bengaluru, Karnataka 560060',
      contactNumber: '+91 90123 45678',
      idType: 'passport',
      idNumber: 'P-4567821',
      departmentIITM: 'Electrical Engineering',
      professorInCharge: 'Prof. K. Sridhar',
      durationFrom: '2025-05-19',
      durationTo: '2025-07-18',
    },
    bank: {
      accountHolderName: 'Rohit Shankar',
      accountNumber: 'XXXX-XXXX-4412',
      ifscCode: 'HDFC0000456',
      bankName: 'HDFC Bank',
      branchName: 'Kengeri',
    },
    documents: [...sampleDocs],
    verification: [
      {
        id: 'v-2',
        action: 'approved',
        actorName: 'Prof. K. Sridhar',
        actorRole: 'supervisor',
        remarks: 'Approved. Eligible to begin on scheduled start date.',
        timestamp: '2025-04-25T10:00:00Z',
      },
    ],
    activities,
    attendance,
    workflow: buildWorkflow('internship_progress', true),
    currentStage: 'internship_progress',
  },
  {
    id: 'app-2025-0003',
    applicantId: 'IITM-INT-1067',
    status: 'in_progress',
    createdAt: '2025-03-10T07:30:00Z',
    updatedAt: '2025-07-10T12:00:00Z',
    submittedAt: '2025-03-10T08:10:00Z',
    personal: {
      fullName: 'Meera Iyer',
      email: 'meera.iyer@example.edu',
      mobile: '+91 99887 76655',
      gender: 'female',
      dateOfBirth: '2001-02-25',
      address: '12, Palm Grove, Kakkanad, Kochi, Kerala 682030',
    },
    academic: {
      collegeName: 'Cochin University of Science & Technology',
      department: 'Mechanical Engineering',
      registerNumber: 'ME19B078',
      yearOfStudy: '4th Year',
      skills: 'ANSYS, SolidWorks, MATLAB, Python',
      areaOfInterest: 'Thermal Engineering, CFD',
    },
    schedule: {
      department: 'Mechanical Engineering',
      professor: 'Prof. R. Nair',
      batch: 'Spring 2025 — Batch C',
      startDate: '2025-04-07',
      endDate: '2025-06-06',
    },
    security: {
      studentName: 'Meera Iyer',
      fatherName: 'Iyer Suresh',
      collegeName: 'Cochin University of Science & Technology',
      presentAddress: '12, Palm Grove, Kakkanad, Kochi, Kerala 682030',
      contactNumber: '+91 99887 76655',
      idType: 'aadhaar',
      idNumber: 'XXXX-XXXX-7654',
      departmentIITM: 'Mechanical Engineering',
      professorInCharge: 'Prof. R. Nair',
      durationFrom: '2025-04-07',
      durationTo: '2025-06-06',
    },
    bank: {
      accountHolderName: 'Meera Iyer',
      accountNumber: 'XXXX-XXXX-1199',
      ifscCode: 'ICIC0000789',
      bankName: 'ICICI Bank',
      branchName: 'Kakkanad',
    },
    documents: [...sampleDocs],
    verification: [
      {
        id: 'v-3',
        action: 'approved',
        actorName: 'Prof. R. Nair',
        actorRole: 'supervisor',
        remarks: 'Approved and onboarded.',
        timestamp: '2025-04-01T09:00:00Z',
      },
    ],
    activities,
    attendance,
    workflow: buildWorkflow('internship_progress', true),
    currentStage: 'internship_progress',
  },
  {
    id: 'app-2025-0004',
    applicantId: 'IITM-INT-1080',
    status: 'submitted',
    createdAt: '2025-05-08T10:00:00Z',
    updatedAt: '2025-05-08T10:25:00Z',
    submittedAt: '2025-05-08T10:25:00Z',
    personal: {
      fullName: 'Karthik Reddy',
      email: 'karthik.reddy@example.edu',
      mobile: '+91 98765 11122',
      gender: 'male',
      dateOfBirth: '2003-07-19',
      address: '88, Hill Road, Jubilee Hills, Hyderabad, Telangana 500033',
    },
    academic: {
      collegeName: 'BITS Pilani, Hyderabad Campus',
      department: 'Computer Science & Engineering',
      registerNumber: 'CS22B017',
      yearOfStudy: '3rd Year',
      skills: 'Go, Kubernetes, Docker, Python',
      areaOfInterest: 'Distributed Systems, Cloud Infrastructure',
    },
    schedule: {
      department: 'Computer Science & Engineering',
      professor: 'Prof. V. Mahesh',
      batch: 'Summer 2025 — Batch A',
      startDate: '2025-06-02',
      endDate: '2025-07-31',
    },
    security: {
      studentName: 'Karthik Reddy',
      fatherName: 'Reddy Venkat',
      collegeName: 'BITS Pilani, Hyderabad Campus',
      presentAddress: '88, Hill Road, Jubilee Hills, Hyderabad, Telangana 500033',
      contactNumber: '+91 98765 11122',
      idType: 'aadhaar',
      idNumber: 'XXXX-XXXX-4521',
      departmentIITM: 'Computer Science & Engineering',
      professorInCharge: 'Prof. V. Mahesh',
      durationFrom: '2025-06-02',
      durationTo: '2025-07-31',
    },
    bank: {
      accountHolderName: 'Karthik Reddy',
      accountNumber: 'XXXX-XXXX-7788',
      ifscCode: 'SBIN0005566',
      bankName: 'State Bank of India',
      branchName: 'Jubilee Hills',
    },
    documents: [...sampleDocs],
    verification: [],
    activities: [],
    attendance: [],
    workflow: buildWorkflow('verification', true),
    currentStage: 'verification',
  },
];

export const mockApplicantUser: User = {
  id: 'usr-app-1042',
  name: 'Ananya Raman',
  email: 'ananya.raman@example.edu',
  role: 'applicant',
};

export const mockSupervisorUser: User = {
  id: 'usr-sup-01',
  name: 'Prof. V. Mahesh',
  email: 'mahesh.v@iitm.ac.in',
  role: 'supervisor',
};

export const mockChairmanUser: User = {
  id: 'usr-chair-01',
  name: 'Prof. S. Gopal',
  email: 'chairman.cse@iitm.ac.in',
  role: 'chairman',
};

export const mockAdminUser: User = {
  id: 'usr-admin-01',
  name: 'Portal Admin',
  email: 'admin@iitm.ac.in',
  role: 'admin',
};

export const mockUsers: User[] = [
  mockApplicantUser,
  mockSupervisorUser,
  mockChairmanUser,
  mockAdminUser,
];

export interface ScheduleOption {
  department: string;
  professor: string;
  batch: string;
  startDate: string;
  endDate: string;
}

export const mockScheduleOptions: ScheduleOption[] = [
  {
    department: 'Computer Science & Engineering',
    professor: 'Prof. V. Mahesh',
    batch: 'Summer 2025 — Batch A',
    startDate: '2025-06-02',
    endDate: '2025-07-31',
  },
  {
    department: 'Computer Science & Engineering',
    professor: 'Prof. A. Rajaram',
    batch: 'Summer 2025 — Batch B',
    startDate: '2025-06-09',
    endDate: '2025-08-08',
  },
  {
    department: 'Electrical Engineering',
    professor: 'Prof. K. Sridhar',
    batch: 'Summer 2025 — Batch B',
    startDate: '2025-05-19',
    endDate: '2025-07-18',
  },
  {
    department: 'Mechanical Engineering',
    professor: 'Prof. R. Nair',
    batch: 'Summer 2025 — Batch C',
    startDate: '2025-07-07',
    endDate: '2025-09-05',
  },
  {
    department: 'Aerospace Engineering',
    professor: 'Prof. P. Menon',
    batch: 'Summer 2025 — Batch A',
    startDate: '2025-06-02',
    endDate: '2025-07-31',
  },
];

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  applicationsCount: number;
  lastActive: string;
}

export const mockAdminUsers: AdminUserRow[] = [
  { id: 'usr-app-1042', name: 'Ananya Raman', email: 'ananya.raman@example.edu', role: 'applicant', applicationsCount: 1, lastActive: '2025-05-01' },
  { id: 'usr-app-1051', name: 'Rohit Shankar', email: 'rohit.shankar@example.edu', role: 'applicant', applicationsCount: 1, lastActive: '2025-05-15' },
  { id: 'usr-app-1067', name: 'Meera Iyer', email: 'meera.iyer@example.edu', role: 'applicant', applicationsCount: 1, lastActive: '2025-07-10' },
  { id: 'usr-app-1080', name: 'Karthik Reddy', email: 'karthik.reddy@example.edu', role: 'applicant', applicationsCount: 1, lastActive: '2025-05-08' },
  { id: 'usr-sup-01', name: 'Prof. V. Mahesh', email: 'mahesh.v@iitm.ac.in', role: 'supervisor', applicationsCount: 4, lastActive: '2025-07-11' },
  { id: 'usr-sup-02', name: 'Prof. K. Sridhar', email: 'sridhar.k@iitm.ac.in', role: 'supervisor', applicationsCount: 2, lastActive: '2025-07-09' },
  { id: 'usr-sup-03', name: 'Prof. R. Nair', email: 'nair.r@iitm.ac.in', role: 'supervisor', applicationsCount: 1, lastActive: '2025-07-05' },
  { id: 'usr-chair-01', name: 'Prof. S. Gopal', email: 'chairman.cse@iitm.ac.in', role: 'chairman', applicationsCount: 0, lastActive: '2025-07-12' },
];
