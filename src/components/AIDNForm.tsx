import { useState, type FormEvent } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface AIDNFormProps {
  fields: FormField[];
  table: string;
  submitLabel?: string;
  onSuccessMessage?: string;
  compact?: boolean;
}

export function AIDNForm({
  fields,
  table,
  submitLabel = 'Submit',
  onSuccessMessage = 'Thank you. We\u2019ll be in touch.',
  compact = false,
}: AIDNFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.from(table).insert([values]);
        if (error) throw error;
      } else {
        // Database not yet provisioned — simulate success
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setStatus('success');
      setValues({});
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="py-8 text-center">
        <p className="text-sm tracking-wide text-white/90">{onSuccessMessage}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs uppercase tracking-widest text-[#c8a45c] hover:text-[#e0bd75] transition-colors"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? 'max-w-md' : 'max-w-lg'}`}>
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-xs uppercase tracking-widest text-white/50 mb-1.5"
          >
            {field.label}
            {field.required && <span className="text-[#c8a45c] ml-1">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#c8a45c]/50 focus:outline-none transition-colors resize-none"
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-[#c8a45c]/50 focus:outline-none transition-colors"
            >
              <option value="" className="bg-[#0a0e14]">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt} className="bg-[#0a0e14]">{opt}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#c8a45c]/50 focus:outline-none transition-colors"
            />
          )}
        </div>
      ))}

      {status === 'error' && (
        <p className="text-xs text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="px-6 py-2.5 text-xs uppercase tracking-widest border border-[#c8a45c]/40 text-[#c8a45c] hover:bg-[#c8a45c]/10 hover:border-[#c8a45c]/60 transition-all duration-300 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}
