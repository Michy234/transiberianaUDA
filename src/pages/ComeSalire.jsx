import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Train, Calendar, ArrowRight } from '@phosphor-icons/react';

function StepCard({ number, title, desc, icon, delay = 0 }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
      className="p-8 rounded-3xl bg-card shadow-[var(--shadow-card)] flex flex-col items-start gap-4 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.01] transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {number}
      </div>
      {icon && <div className="text-muted-foreground mb-1" aria-hidden="true">{icon}</div>}
      <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.article>
  );
}

export default function ComeSalire() {
  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
       <div className="max-w-3xl mx-auto text-center mb-20">
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary font-semibold text-sm mb-6">
           <Ticket weight="fill" size={16} />
           Guida all'acquisto
         </motion.div>
         <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-[-0.03em] mb-8 text-foreground">Come salire a bordo</h1>
         <p className="text-xl text-muted-foreground leading-relaxed max-w-[55ch] mx-auto">
           Prenotare il tuo viaggio sulla ferrovia storica è semplice. Segui i nostri consigli per assicurarti il posto e goderti l'esperienza senza pensieri.
         </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
         <StepCard 
           number="01" 
           title="Scegli la data" 
           desc="Consulta il calendario delle partenze. I treni storici non viaggiano tutti i giorni, le date speciali (es. Treni della Neve o Mercatini) si esauriscono in fretta."
           icon={<Calendar size={28} weight="duotone" />}
           delay={0}
         />
         <div className="md:mt-12">
           <StepCard 
             number="02" 
             title="Acquista il biglietto" 
             desc="La prenotazione è obbligatoria e si effettua esclusivamente online tramite il portale ufficiale. Non è possibile fare il biglietto a bordo."
             icon={<Ticket size={28} weight="duotone" />}
             delay={0.1}
           />
         </div>
         <StepCard 
           number="03" 
           title="Preparati al viaggio" 
           desc="Arriva in stazione a Sulmona almeno 30 minuti prima della partenza. Riceverai il tuo posto assegnato sui sedili originali in velluto e legno degli anni '30."
           icon={<Train size={28} weight="duotone" />}
           delay={0.2}
         />
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
         className="mt-16 max-w-3xl mx-auto bg-card rounded-3xl p-10 flex items-center justify-between flex-col sm:flex-row gap-6 text-center sm:text-left shadow-[var(--shadow-card)]"
       >
         <div>
           <div className="font-serif font-bold text-2xl mb-2 text-foreground">Pronto a viaggiare?</div>
           <div className="text-muted-foreground text-sm max-w-sm">Verifica le disponibilità aggiornate per le partenze dei prossimi mesi.</div>
         </div>
         <button className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 shadow-[var(--shadow-button)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
           Acquista ora <ArrowRight weight="bold" size={18} />
         </button>
       </motion.div>
    </div>
  );
}
