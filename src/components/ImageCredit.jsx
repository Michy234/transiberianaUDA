import React from 'react';
import { getImageCredit } from '../data/imageCredits';

export default function ImageCredit({ src, className = '', linkClassName = '' }) {
  const credit = getImageCredit(src);
  if (!credit) return null;

  return (
    <p className={`text-[11px] leading-snug text-muted-foreground ${className}`.trim()}>
      Fonte:{' '}
      <a
        href={credit.url}
        target="_blank"
        rel="noreferrer"
        className={`underline underline-offset-2 hover:text-foreground ${linkClassName}`.trim()}
      >
        {credit.label}
      </a>
    </p>
  );
}
