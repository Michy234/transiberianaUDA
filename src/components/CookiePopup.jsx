import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';

const STORAGE_KEY = 'transiberiana-cookie-notice-dismissed';

export default function CookiePopup() {
  const [visible, setVisible] = useState(false);
  const { lang } = useI18n();
  const isItalian = lang === 'it';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const acknowledge = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch (_) {
      // Ignore storage errors.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-[min(90vw,360px)] rounded-3xl border border-border/70 bg-card/90 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-foreground">
        {isItalian ? 'Cookie e preferenze' : 'Cookies and preferences'}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {isItalian
          ? 'Questa demo usa solo preferenze tecniche locali per ricordare tema, lingua e la chiusura di questo avviso. Non raccoglie dati personali e non offre un modulo email attivo.'
          : 'This demo only uses local technical preferences to remember theme, language, and dismissal of this notice. It does not collect personal data and it does not offer an active email form.'}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          to="/cookie-policy"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:shadow-[var(--shadow-card)]"
        >
          {isItalian ? 'Leggi la cookie policy' : 'Read the cookie policy'}
        </Link>
        <button
          type="button"
          onClick={acknowledge}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition-all hover:scale-[1.01] active:scale-[0.98]"
        >
          {isItalian ? 'Ho capito' : 'Understood'}
        </button>
      </div>
    </div>
  );
}
