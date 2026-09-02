import { useState } from 'react';
import { AIDNForm, type FormField } from '@/components/AIDNForm';
import { GET_INVOLVED_COPY, SOCIAL_LINKS } from '@/data/content';

const PARTNER_FIELDS: FormField[] = [
  {
    name: 'organization',
    label: 'Organization',
    type: 'text',
    placeholder: 'Company / Organization name',
    required: true,
  },
  {
    name: 'contact_name',
    label: 'Contact Name',
    type: 'text',
    placeholder: 'Your name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@organization.com',
    required: true,
  },
  {
    name: 'partnership_type',
    label: 'Partnership Type',
    type: 'select',
    options: ['Sponsor', 'Partner', 'Co-host', 'Other'],
    required: true,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell us about how you\u2019d like to partner with AIDN.',
  },
];

const COLLABORATOR_FIELDS: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@email.com',
    required: true,
  },
  {
    name: 'community',
    label: 'Community / Group',
    type: 'text',
    placeholder: 'Community or group you represent',
  },
  {
    name: 'collaboration_type',
    label: 'Collaboration Type',
    type: 'select',
    options: ['Event Collaboration', 'Content / Knowledge', 'Technical', 'Other'],
    required: true,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell us about how you\u2019d like to collaborate.',
  },
];

export function GetInvolved() {
  const [expandedCard, setExpandedCard] = useState<'partner' | 'collaborator' | null>(null);

  return (
    <section
      id="get-involved"
      className="relative bg-[#05070a] py-24 sm:py-32 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4">
          Get Involved
        </h2>
        <p className="text-2xl sm:text-3xl md:text-4xl font-display tracking-tight text-white/80 mb-16">
          {GET_INVOLVED_COPY}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
          {/* Partner / Sponsor — left */}
          <div className="md:mt-12">
            <GetInvolvedCard
              title="Join as a Partner / Sponsor"
              onClick={() => setExpandedCard(expandedCard === 'partner' ? null : 'partner')}
              isExpanded={expandedCard === 'partner'}
            >
              <AIDNForm
                fields={PARTNER_FIELDS}
                table="partner_sponsor_submissions"
                submitLabel="Submit Partnership"
                onSuccessMessage="Thank you. We\u2019ll be in touch about partnering with AIDN."
                compact
              />
            </GetInvolvedCard>
          </div>

          {/* Member — center */}
          <div>
            <GetInvolvedCard
              title="Join as a Member"
              onClick={() => {
                window.open(SOCIAL_LINKS.linktree, '_blank');
              }}
              isMember
            />
          </div>

          {/* Collaborator — right */}
          <div className="md:mt-12">
            <GetInvolvedCard
              title="Join as a Collaborator"
              onClick={() => setExpandedCard(expandedCard === 'collaborator' ? null : 'collaborator')}
              isExpanded={expandedCard === 'collaborator'}
            >
              <AIDNForm
                fields={COLLABORATOR_FIELDS}
                table="collaborator_submissions"
                submitLabel="Submit Collaboration"
                onSuccessMessage="Thank you. We\u2019ll be in touch about collaborating with AIDN."
                compact
              />
            </GetInvolvedCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function GetInvolvedCard({
  title,
  onClick,
  isExpanded,
  isMember,
  children,
}: {
  title: string;
  onClick: () => void;
  isExpanded?: boolean;
  isMember?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        aspectRatio: isExpanded ? undefined : '3 / 4',
        transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
        border: '1px solid rgba(255,255,255,0.08)',
        background: isExpanded ? 'rgba(255,255,255,0.02)' : 'rgba(10,14,20,0.8)',
      }}
    >
      {!isExpanded && (
        <button
          onClick={onClick}
          className="absolute inset-0 w-full h-full flex items-end p-5 sm:p-6 text-left group"
        >
          <div>
            <h3 className="text-base sm:text-lg font-display tracking-tight text-white/80 group-hover:text-white transition-colors">
              {title}
            </h3>
            <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#c8a45c]/60 group-hover:text-[#c8a45c] transition-colors">
              <span>{isMember ? 'Visit' : 'Expand'}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                {isMember ? (
                  <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                ) : (
                  <path d="M5 2V8M2 5H8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                )}
              </svg>
            </div>
          </div>
        </button>
      )}

      {isExpanded && (
        <div
          className="p-6"
          style={{ animation: 'fade-in-up 0.4s ease forwards' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-display tracking-tight text-white/80">{title}</h3>
            <button
              onClick={onClick}
              className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
            >
              Close
            </button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
