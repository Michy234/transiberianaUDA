import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/index.jsx';

const legalLinks = [
  { path: '/privacy', it: 'Privacy Policy', en: 'Privacy Policy' },
  { path: '/cookie-policy', it: 'Cookie Policy', en: 'Cookie Policy' },
  { path: '/note-legali', it: 'Note legali', en: 'Legal notice' },
  { path: '/accessibilita', it: 'Accessibilita e demo', en: 'Accessibility and demo' },
];

export default function SiteFooter() {
  const { lang } = useI18n();
  const isItalian = lang === 'it';

  return (
    <footer className="border-t border-border/60 bg-card/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-10 md:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              {isItalian ? 'Progetto scolastico' : 'School project'}
            </div>
            <p className="mt-3 max-w-[64ch] text-sm leading-relaxed text-foreground/82">
              {isItalian
                ? 'Questa applicazione e pubblicata come demo scolastica non ufficiale. Non rappresenta un servizio commerciale attivo, non gestisce prenotazioni e non invita al conferimento di dati personali tramite moduli.'
                : 'This application is published as an unofficial school demo. It is not an active commercial service, it does not manage bookings, and it does not invite users to submit personal data through forms.'}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {isItalian
                ? 'Ultimo aggiornamento delle informazioni legali: 17 marzo 2026.'
                : 'Last legal information update: March 17, 2026.'}
            </p>
          </div>

          <nav aria-label={isItalian ? 'Link legali' : 'Legal links'}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              {isItalian ? 'Documenti' : 'Documents'}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="inline-flex w-fit items-center rounded-2xl border border-border/60 bg-background/65 px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:shadow-[var(--shadow-subtle)] hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isItalian ? link.it : link.en}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
