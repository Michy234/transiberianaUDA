import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n/index.jsx';

function SectionCard({ section }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
      <h2 className="text-2xl font-serif font-bold tracking-tight text-foreground">{section.title}</h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-[0.98rem] leading-relaxed text-foreground/85">
          {paragraph}
        </p>
      ))}
      {section.list?.length ? (
        <ul className="mt-5 space-y-3 text-[0.98rem] leading-relaxed text-foreground/85">
          {section.list.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {section.note ? (
        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/8 px-5 py-4 text-sm leading-relaxed text-foreground/80">
          {section.note}
        </div>
      ) : null}
    </section>
  );
}

function MetaCard({ meta }) {
  const { lang } = useI18n();
  const isItalian = lang === 'it';

  return (
    <div className="rounded-3xl border border-border/60 bg-card/78 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {isItalian ? 'Riepilogo' : 'Summary'}
      </div>
      <div className="mt-4 space-y-4">
        {meta.map((item) => (
          <div key={item.label}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {item.label}
            </div>
            <div className="mt-1 text-sm leading-relaxed text-foreground/85">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LegalPageLayout({
  badge,
  title,
  intro,
  meta,
  sections,
}) {
  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-12">
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
        >
          <div className="rounded-[2rem] border border-border/60 bg-card/82 p-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
              {badge}
            </div>
            <h1 className="mt-6 text-4xl font-serif font-bold tracking-[-0.03em] text-foreground md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">{intro}</p>
          </div>
          {meta?.length ? <div className="mt-5"><MetaCard meta={meta} /></div> : null}
        </motion.aside>

        <div className="flex flex-col gap-5 lg:col-span-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, type: 'spring', stiffness: 140, damping: 24 }}
            >
              <SectionCard section={section} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
