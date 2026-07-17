import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import { WorkflowStepper } from '../../components/workflow/WorkflowStepper';
import {
  Step1ApplicationForm,
  Step2ScheduleSelection,
  Step3SecurityForm,
  Step4BankDocuments,
  Step5Review,
  type ApplicationFormData,
} from '../../components/forms/ApplicationWizardSteps';
import { workflowStageDefs } from '../../mock-data/applications';
import { applicationService } from '../../services/applicationService';
import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import type { DocumentFile, DocumentKey, WorkflowStage } from '../../types';

const STEPS = workflowStageDefs.slice(0, 5);

function defaultFormData(): ApplicationFormData {
  return {
    personal: { fullName: '', email: '', mobile: '', gender: 'male', dateOfBirth: '', address: '' },
    academic: { collegeName: '', department: '', registerNumber: '', yearOfStudy: '', skills: '', areaOfInterest: '' },
    schedule: { department: '', professor: '', batch: '', startDate: '', endDate: '', duration: '' },
    security: {
      studentName: '', fatherName: '', collegeName: '', presentAddress: '', contactNumber: '',
      idType: 'aadhaar', idNumber: '', departmentIITM: '', professorInCharge: '', durationFrom: '', durationTo: '',
    },
    bank: { accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', branchName: '' },
    documents: [],
    documentsByKey: {},
    securitySignatures: {},
    certificates: [],
    chairmanSigned: false,
    locked: false,
  };
}

export function ApplicationWizard() {
  const navigate = useNavigate();
  const { applications, refresh } = useApplications();
  const { user } = useRole();
  const existing = applications.find((a) => a.personal.email === user.email) ?? applications[0];

  const [step, setStep] = useState(0);
  const [docs, setDocs] = useState<Partial<Record<DocumentKey, DocumentFile>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const methods = useForm<ApplicationFormData>({
    defaultValues: existing
      ? {
          ...existing,
          documentsByKey: Object.fromEntries(existing.documents.map((d) => [d.key, d])),
        }
      : defaultFormData(),
    mode: 'onTouched',
  });

  const stageList: WorkflowStage[] = useMemo(
    () =>
      STEPS.map((s, idx) => ({
        id: s.id,
        label: s.label,
        description: s.description,
        status: idx < step ? 'done' : idx === step ? 'current' : 'pending',
      })),
    [step],
  );

  const handleUpload = (key: DocumentKey, file: DocumentFile) => {
    setDocs((prev) => ({ ...prev, [key]: file }));
    const allDocs = Object.values({ ...docs, [key]: file }).filter(Boolean) as DocumentFile[];
    methods.setValue('documents', allDocs);
    methods.setValue('documentsByKey', { ...docs, [key]: file });
  };

  const handleRemove = (key: DocumentKey) => {
    setDocs((prev) => {
      const next = { ...prev };
      delete next[key];
      const allDocs = Object.values(next).filter(Boolean) as DocumentFile[];
      methods.setValue('documents', allDocs);
      methods.setValue('documentsByKey', next);
      return next;
    });
  };

  const next = async () => {
    const valid = await methods.trigger();
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const saveDraft = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const id = existing?.id ?? 'app-2025-0005';
      await applicationService.submitForVerification(id);
      await refresh();
      navigate(`/applications/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8">
      <WorkflowStepper stages={stageList} currentIndex={step} onStepClick={(idx) => idx <= step && setStep(idx)} />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="animate-fade-in">
              {step === 0 && <Step1ApplicationForm />}
              {step === 1 && <Step2ScheduleSelection />}
              {step === 2 && <Step3SecurityForm />}
              {step === 3 && <Step4BankDocuments documentsByKey={docs} onUpload={handleUpload} onRemove={handleRemove} />}
              {step === 4 && <Step5Review onSubmit={submit} />}
            </div>

            {step < STEPS.length - 1 ? (
              <div className="mt-8 flex items-center justify-between">
                <button type="button" onClick={back} disabled={step === 0} className="btn-secondary">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={saveDraft} className="btn-ghost">
                    <Save className="h-4 w-4" /> {saved ? 'Saved' : 'Save Draft'}
                  </button>
                  <button type="button" onClick={next} className="btn-primary">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex items-center justify-between">
                <button type="button" onClick={back} className="btn-secondary">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" onClick={submit} disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting…' : 'Submit For Verification'} <Send className="h-4 w-4" />
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
