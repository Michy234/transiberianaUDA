import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'transiberiana-cookie-consent';

export default function CookiePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch (_) {
      // Ignore storage errors.
    }
    setVisible(false);
  };

  const dismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-[min(90vw,360px)] rounded-3xl border border-border/70 bg-card/90 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-foreground">Cookie</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Usiamo cookie tecnici e di analisi per migliorare l’esperienza. Puoi accettare o chiudere questo messaggio.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={accept}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition-all hover:scale-[1.01] active:scale-[0.98]"
        >
          Accetta
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:shadow-[var(--shadow-card)]"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}
