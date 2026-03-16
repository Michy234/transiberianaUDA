import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Tree, Sun, MapPin, CloudSun, Sparkle, Train, Wind } from '@phosphor-icons/react';
import { useI18n } from '../i18n/index.jsx';

const ICONS = [Tree, Leaf, Sun, MapPin, CloudSun, Sparkle, Train, Wind];

export default function DecalogoAmbientale() {
  const { t, tm } = useI18n();
  const eco = tm('decalogo.eco', { items: [] });
  const digital = tm('decalogo.digital', { hardware: [], ethics: [] });

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end"
      >
        <div className="lg:col-span-7">
          <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground mb-4">
            {t('decalogo.kicker', 'Responsabilità, cura, consapevolezza')}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-[-0.03em] text-foreground">
            {t('decalogo.title', 'Decalogo ambientale')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[52ch]">
            {t(
              'decalogo.subtitle',
              'Due liste di buone pratiche per ridurre il nostro impatto: una per la natura che ci circonda e una per il mondo digitale che usiamo ogni giorno.',
            )}
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-card border border-border/70 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-subtle)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                <Leaf size={22} weight="fill" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('decalogo.card.kicker', 'Piccole azioni')}</p>
                <p className="font-semibold text-foreground">{t('decalogo.card.title', 'Impatto reale')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'decalogo.card.body',
                'Ridurre sprechi, scegliere con cura e condividere buone pratiche: ogni gesto quotidiano può diventare un passo concreto verso un futuro più pulito.',
              )}
            </p>
          </div>
        </div>
      </motion.header>

      <section className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-accent-warm/30 text-wood flex items-center justify-center">
            <Tree size={20} weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              {t('decalogo.eco.title', 'Decalogo ambientale')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('decalogo.eco.subtitle', 'Per territorio, acqua, aria e biodiversità.')}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {eco.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border/70 rounded-3xl p-6 md:p-7 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon size={20} weight="fill" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{String(index + 1).padStart(2, '0')}</p>
                    <h3 className="text-lg font-bold text-foreground mt-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{item.body}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
            <CloudSun size={20} weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              {t('decalogo.digital.title', 'Decalogo per la sostenibilità digitale')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('decalogo.digital.subtitle', 'Per dispositivi, energia e benessere online.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <div className="bg-accent/40 border border-border/70 rounded-3xl p-6 md:p-7 shadow-[var(--shadow-subtle)]">
              <h3 className="text-lg font-bold text-foreground mb-4">
                {t('decalogo.digital.hardwareTitle', 'Hardware e dispositivi fisici')}
              </h3>
              <div className="space-y-4">
                {digital.hardware.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-card text-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-card border border-border/70 rounded-3xl p-6 md:p-7 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-bold text-foreground mb-4">
                {t('decalogo.digital.ethicsTitle', 'Etica, consapevolezza e benessere digitale')}
              </h3>
              <div className="space-y-4">
                {digital.ethics.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold">{index + 6}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
