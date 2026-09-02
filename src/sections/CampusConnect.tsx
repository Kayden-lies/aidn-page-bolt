import { useRef } from 'react';
import { CampusDoorCanvas } from '@/three/CampusDoor';
import { AIDNForm, type FormField } from '@/components/AIDNForm';
import { CAMPUS_CONNECT_COPY } from '@/data/content';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const CAMPUS_CONNECT_FIELDS: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@institution.edu',
    required: true,
  },
  {
    name: 'institution',
    label: 'Institution',
    type: 'text',
    placeholder: 'College / University name',
    required: true,
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: ['Student', 'Faculty', 'Club / Council Member', 'Administration'],
    required: true,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell us about your institution and how you\u2019d like to collaborate.',
  },
];

export function CampusConnect() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const openAmountRef = useRef(0);
  openAmountRef.current = Math.max(0, Math.min(1, (progress - 0.15) / 0.5));

  return (
    <section
      ref={sectionRef}
      id="campus-connect"
      className="relative bg-[#05070a]"
      style={{ height: '220vh' }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: 3D Door */}
            <div className="relative h-[50vh] md:h-[65vh]">
              <CampusDoorCanvas openAmount={openAmountRef} />
            </div>

            {/* Right: Description + Form */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                AIDN Campus Connect
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-tight text-white">
                Campus Connect
              </h2>
              <div className="space-y-3">
                {CAMPUS_CONNECT_COPY.map((line, i) => (
                  <p key={i} className="text-sm text-white/50 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
              <div className="pt-4">
                <AIDNForm
                  fields={CAMPUS_CONNECT_FIELDS}
                  table="campus_connect_submissions"
                  submitLabel="Start the Conversation"
                  onSuccessMessage="Thank you. We\u2019ll reach out about Campus Connect soon."
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
