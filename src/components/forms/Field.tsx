import type { ReactNode } from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';
import { classNames } from '../../utils/format';

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  hint?: string;
  rules?: RegisterOptions;
  className?: string;
  children?: ReactNode;
}

export function Field({ name, label, type = 'text', placeholder, options, rows, hint, rules, className, children }: FieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  const baseInput = 'input';
  const inputClass = classNames(baseInput, error && 'ring-error-300 focus:ring-error-500');

  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
        {rules?.required && <span className="ml-0.5 text-error-500">*</span>}
      </label>
      <div className="mt-1.5">
        {children ? (
          children
        ) : type === 'select' ? (
          <select id={name} className={inputClass} {...register(name, rules)}>
            <option value="">{placeholder ?? 'Select…'}</option>
            {options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea id={name} rows={rows ?? 3} className={inputClass} placeholder={placeholder} {...register(name, rules)} />
        ) : (
          <input id={name} type={type} className={inputClass} placeholder={placeholder} {...register(name, rules)} />
        )}
      </div>
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function FieldSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="card p-6">
      <div className="mb-5">
        <h3 className="section-title">{title}</h3>
        {description && <p className="section-subtitle">{description}</p>}
      </div>
      {children}
    </section>
  );
}
