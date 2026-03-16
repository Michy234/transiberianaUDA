import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n/index.jsx';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-[100dvh] bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary text-sm font-semibold tracking-tight mb-8"
        >
          {t('notFound.badge', 'Errore 404')}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: 'spring', stiffness: 120, damping: 18 }}
          className="text-4xl md:text-6xl font-serif font-bold tracking-[-0.03em] text-foreground mb-6"
        >
          {t('notFound.title', 'Pagina non trovata')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="text-lg text-muted-foreground leading-relaxed max-w-[60ch] mx-auto mb-10"
        >
          {t(
            'notFound.body',
            'La pagina che stai cercando non esiste o è stata spostata. Puoi tornare alla home e riprendere il viaggio.',
          )}
        </motion.p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[var(--shadow-button)]"
        >
          {t('notFound.cta', 'Torna alla home')}
          <ArrowRight weight="bold" size={18} />
        </Link>
      </div>
    </div>
  );
}
