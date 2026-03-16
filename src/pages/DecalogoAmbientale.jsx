import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Tree, Sun, MapPin, CloudSun, Sparkle, Train, Wind } from '@phosphor-icons/react';
import { useI18n } from '../i18n/index.jsx';

const ECO_DECALOGO = [
  {
    title: "Le 3 R: Riduci, Riusa, Ricicla",
    body: "Produci meno rifiuti, riutilizza quello che puoi e fai bene la raccolta differenziata. Gli elettrodomestici e le batterie vanno all'isola ecologica, mai nell'indifferenziata.",
  },
  {
    title: "Stop all'usa e getta e spiagge pulite",
    body: "Usa borracce e borse di tela. Al mare porta via i tuoi rifiuti e usa un posacenere portatile: i mozziconi inquinano l'acqua e i pesci.",
  },
  {
    title: "Risparmia acqua ed energia in casa",
    body: "Spegni le luci, usa LED e non tenere il riscaldamento troppo alto. Chiudi il rubinetto mentre ti lavi i denti, ripara le perdite e non versare olio o vernici nel lavandino.",
  },
  {
    title: "Muoviti in modo intelligente",
    body: "Preferisci bicicletta, camminate e mezzi pubblici. Usare meno l'auto significa respirare un'aria più pulita.",
  },
  {
    title: "Compra cibo locale e di stagione",
    body: "Scegli prodotti del territorio per ridurre i trasporti. Mangiare un po' meno carne aiuta a risparmiare molta acqua e a inquinare meno.",
  },
  {
    title: "Compra solo ciò che serve",
    body: "Vestiti e oggetti costano molta energia alla natura. Compra il necessario, meglio se usato, ed evita packaging in eccesso.",
  },
  {
    title: "Rispetta la natura selvaggia e i parchi",
    body: "Rimani sui sentieri segnati, non lasciare sporco e non fare rumori forti (come con i droni) per non disturbare la fauna.",
  },
  {
    title: "Pensa al futuro",
    body: "Non possiamo prendere risorse senza restituire. L'obiettivo è curare la natura per lasciarla in salute a chi verrà dopo di noi.",
  },
  {
    title: "Fai la tua parte e fai sentire la tua voce",
    body: "Se vedi comportamenti scorretti, segnala. Partecipa alle giornate di pulizia di spiagge e parchi della tua zona.",
  },
  {
    title: "Sii un custode, non un padrone",
    body: "Il vero progresso è vivere in armonia con la natura, rispettandone gli equilibri per non danneggiare noi stessi.",
  },
];

const DIGITAL_DECALOGO = {
  hardware: [
    {
      title: "Ricicla e smaltisci correttamente i dispositivi elettronici",
      body: "I RAEE contengono materiali preziosi e sostanze tossiche: portali alle isole ecologiche o nei negozi che ritirano l'usato.",
    },
    {
      title: "Usa a lungo i tuoi dispositivi",
      body: "Gran parte dell'impatto ambientale è nella produzione. Resisti al cambio continuo e prova a riparare prima di sostituire.",
    },
    {
      title: "Spegni ciò che non usi",
      body: "Il consumo \"fantasma\" dello standby pesa su bolletta e ambiente. Spegni il PC se non lo usi e stacca i caricabatterie.",
    },
    {
      title: "Scegli dispositivi efficienti e sostenibili",
      body: "Quando devi comprare, controlla l'efficienza energetica e valuta il ricondizionato per allungare la vita dei prodotti.",
    },
    {
      title: "Stai attento a cosa stampi e quanto stampi",
      body: "Carta e inchiostro hanno un costo ecologico elevato. Stampa solo se indispensabile e usa fronte-retro e bianco e nero.",
    },
  ],
  etica: [
    {
      title: "Scegli motori di ricerca ecologici",
      body: "Esistono alternative che investono i profitti in riforestazione o energie rinnovabili.",
    },
    {
      title: "Limita il doomscrolling (e disconnettiti)",
      body: "Scorrere all'infinito consuma dati e energia. Un detox digitale fa bene a te e all'ambiente.",
    },
    {
      title: "Segna i siti tra i preferiti",
      body: "Se visiti spesso un sito, salvalo nei segnalibri: eviti ricerche ripetute e traffico inutile.",
    },
    {
      title: "Fai attenzione all'uso dell'Intelligenza Artificiale",
      body: "Generare immagini o testi richiede molta energia. Usala per compiti complessi, non per ricerche banali.",
    },
    {
      title: "Sensibilizza gli altri",
      body: "L'inquinamento digitale è invisibile: condividi queste buone pratiche a scuola, in famiglia e con gli amici.",
    },
  ],
};

const ICONS = [Tree, Leaf, Sun, MapPin, CloudSun, Sparkle, Train, Wind];

export default function DecalogoAmbientale() {
  const { t } = useI18n();

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
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Decalogo ambientale</h2>
            <p className="text-sm text-muted-foreground">Per territorio, acqua, aria e biodiversità.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ECO_DECALOGO.map((item, index) => {
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
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Decalogo per la sostenibilità digitale</h2>
            <p className="text-sm text-muted-foreground">Per dispositivi, energia e benessere online.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <div className="bg-accent/40 border border-border/70 rounded-3xl p-6 md:p-7 shadow-[var(--shadow-subtle)]">
              <h3 className="text-lg font-bold text-foreground mb-4">Hardware e dispositivi fisici</h3>
              <div className="space-y-4">
                {DIGITAL_DECALOGO.hardware.map((item, index) => (
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
              <h3 className="text-lg font-bold text-foreground mb-4">Etica, consapevolezza e benessere digitale</h3>
              <div className="space-y-4">
                {DIGITAL_DECALOGO.etica.map((item, index) => (
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
