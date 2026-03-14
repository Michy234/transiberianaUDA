import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Train, Calendar, Info, ArrowRight } from '@phosphor-icons/react';

function StepCard({ number, title, desc, icon }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-[2rem] bg-secondary/50 border border-border flex flex-col items-start gap-4"
    >
      <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-mono text-xl mb-4">
        {number}
      </div>
      {icon && <div className="text-foreground/50 mb-2">{icon}</div>}
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-foreground/70 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function ComeSalire() {
  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
       <div className="max-w-3xl mx-auto text-center mb-24">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
           <Ticket weight="fill" />
           Guida all'Acquisto
         </motion.div>
         <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-foreground">Come Salire a Bordo</h1>
         <p className="text-xl text-foreground/60 leading-relaxed">
           Prenotare il tuo viaggio sulla ferrovia storica è semplice. Segui i nostri consigli per assicurarti il posto e goderti l'esperienza senza pensieri.
         </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
         <StepCard 
           number="01" 
           title="Scegli la Data" 
           desc="Consulta il calendario delle partenze. I treni storici non viaggiano tutti i giorni, le date speciali (es. Treni della Neve o Mercatini) si esauriscono in fretta."
           icon={<Calendar size={32} weight="duotone" />}
         />
         <StepCard 
           number="02" 
           title="Acquista il Biglietto" 
           desc="La prenotazione è obbligatoria e si effettua esclusivamente online tramite il portale ufficiale. Non è possibile fare il biglietto a bordo."
           icon={<Ticket size={32} weight="duotone" />}
         />
         <StepCard 
           number="03" 
           title="Preparati al Viaggio" 
           desc="Arriva in stazione a Sulmona almeno 30 minuti prima della partenza. Riceverai il tuo posto assegnato sui sedili originali in velluto e legno degli anni '30."
           icon={<Train size={32} weight="duotone" />}
         />
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
         className="mt-16 max-w-3xl mx-auto bg-card rounded-[2.5rem] p-10 flex items-center justify-between border border-border flex-col sm:flex-row gap-6 text-center sm:text-left shadow-sm"
       >
         <div>
           <div className="font-bold text-2xl mb-2">Pronto a viaggiare?</div>
           <div className="text-foreground/70 text-sm max-w-sm">Verifica le disponibilità aggiornate per le partenze dei prossimi mesi.</div>
         </div>
         <button className="px-8 py-4 rounded-full bg-foreground text-background font-medium whitespace-nowrap hover:scale-105 transition-transform flex items-center gap-2">
           Acquista Ora <ArrowRight weight="bold" />
         </button>
       </motion.div>
    </div>
  );
}
