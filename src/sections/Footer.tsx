import { SOCIAL_LINKS } from '@/data/content';

export function Footer() {
  const links = [
    { label: 'Instagram', href: SOCIAL_LINKS.instagram },
    { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
    { label: 'Meetup', href: SOCIAL_LINKS.meetup },
    { label: 'Commudle', href: SOCIAL_LINKS.commudle },
    { label: 'Linktree', href: SOCIAL_LINKS.linktree },
  ];

  return (
    <footer className="bg-[#05070a] pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-display tracking-wide text-white/50">
            AIDN
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
            Artificial Intelligence Developer Network
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-[10px] text-white/20 mt-12 tracking-wide">
            &copy; AIDN &middot; aidn.co.in
          </p>
        </div>
      </div>
    </footer>
  );
}
