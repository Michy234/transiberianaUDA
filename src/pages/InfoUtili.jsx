import React from 'react';
import { motion } from 'framer-motion';
import { Question, Warning, Star, ArrowSquareOut } from '@phosphor-icons/react';
import { useI18n } from '../i18n/index.jsx';

const TRIPADVISOR_URL =
  'https://www.tripadvisor.it/Attraction_Review-g194928-d12914784-Reviews-Transiberiana_d_Italia-Sulmona_Province_of_L_Aquila_Abruzzo.html';

const DEFAULT_FAQ = [
  { q: "Il treno è riscaldato in inverno?", a: "Sì, tutte le carrozze d'epoca sono dotate di riscaldamento a vapore e termosifoni originali restaurati e funzionanti." },
  { q: "Posso portare il mio cane a bordo?", a: "I cani di piccola taglia sono ammessi gratuitamente all'interno dell'apposito trasportino. I cani di taglia superiore necessitano di un biglietto dedicato." },
  { q: "Ci sono toilette a bordo?", a: "Sì, sebbene siano le originali degli anni '30. Suggeriamo di usufruire dei bagni presenti nelle stazioni di sosta per maggiore comodità." },
  { q: "Posso portare cibo a bordo?", a: "Assolutamente sì. Non è presente una carrozza ristorante, quindi il pranzo al sacco è benvenuto, specialmente durante le soste più lunghe nei borghi." },
  { q: "Come mi devo vestire?", a: "Ti consigliamo abbigliamento comodo, scarpe adatte a camminare e uno strato in più nelle fermate di montagna, anche in primavera." },
  { q: "Il treno è accessibile a persone con mobilità ridotta?", a: "Le carrozze storiche hanno accessi più complessi rispetto ai treni moderni. Conviene contattare l'organizzazione prima della partenza per verificare l'assistenza disponibile." },
  { q: "Cosa succede in caso di emergenza?", a: "Rivolgiti subito al personale di bordo. Per emergenze sanitarie gravi, chiama il 112." }
];

export default function InfoUtili() {
  const { t, tm } = useI18n();
  const faq = tm('info.faq', DEFAULT_FAQ);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5 h-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-32">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-[-0.03em] mb-8 text-foreground">
            {t('info.title.lead', 'Info')} <span className="text-primary italic">{t('info.title.accent', 'utili')}</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-[40ch]">
            {t(
              'info.subtitle',
              "Tutto quello che c'è da sapere prima di imbarcarsi in questa avventura retrò tra le montagne abruzzesi.",
            )}
          </p>

          <a
            href={TRIPADVISOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#00AA6C] text-white font-bold shadow-[var(--shadow-button)] hover:brightness-110 active:brightness-95 transition-all duration-200"
            aria-label={t('info.tripadvisorAria', 'Apri le recensioni su TripAdvisor (si apre in una nuova scheda)')}
          >
            <span className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shrink-0" aria-hidden="true">
              <span className="text-[#00AA6C] font-extrabold text-sm tracking-tight">TA</span>
            </span>
            <span className="flex items-center gap-2">
              <Star size={18} weight="fill" />
              {t('info.tripadvisorLabel', 'Recensioni TripAdvisor')}
            </span>
            <ArrowSquareOut size={18} className="opacity-90" aria-hidden="true" />
          </a>

          {/* Rules Card — amber in light, warm wood in dark */}
          <div className="p-8 rounded-3xl bg-accent-warm/20 border border-accent-warm/30 shadow-[var(--shadow-subtle)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-warm/30 flex items-center justify-center">
                <Warning size={20} className="text-wood" weight="fill" />
              </div>
              <h3 className="font-bold text-lg text-foreground">{t('info.rules.title', 'Regole a bordo')}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(
                'info.rules.body',
                "I treni storici richiedono attenzione. Non sporgersi dai finestrini durante la marcia, non gettare rifiuti dal treno, e mantenere comportamenti rispettosi dei materiali d'epoca e degli altri viaggiatori.",
              )}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-5" role="list" aria-label={t('info.faqAria', 'Domande frequenti')}>
        {faq.map((item, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 22 }}
            className="bg-card p-8 rounded-3xl shadow-[var(--shadow-card)] flex gap-5 group hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.01] transition-all duration-300"
            role="listitem"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary shrink-0 flex items-center justify-center" aria-hidden="true">
              <Question size={20} weight="duotone" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-2 text-foreground group-hover:text-primary transition-colors duration-200">{item.q}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          </motion.article>
        ))}
      </div>

    </div>
  );
}
