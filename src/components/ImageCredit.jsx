import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import { getImageCredit } from '../data/imageCredits';

export default function ImageCredit({ src, className = '', linkClassName = '' }) {
  const { lang } = useI18n();
  const credit = getImageCredit(src);
  if (!credit) return null;
  const prefix = lang === 'it' ? 'Fonte immagine' : 'Image credit';

  return (
    <p className={`text-[11px] leading-snug text-muted-foreground ${className}`.trim()}>
      {prefix}:{' '}
      {credit.url ? (
        <a
          href={credit.url}
          target="_blank"
          rel="noreferrer"
          className={`underline underline-offset-2 hover:text-foreground ${linkClassName}`.trim()}
        >
          {credit.label}
        </a>
      ) : (
        <span className={linkClassName}>{credit.label}</span>
      )}
    </p>
  );
}
