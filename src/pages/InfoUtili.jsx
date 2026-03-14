import React from 'react';
import { motion } from 'framer-motion';
import { Question, Warning } from '@phosphor-icons/react';

const faq = [
  { q: "Il treno è riscaldato in inverno?", a: "Sì, tutte le carrozze d'epoca sono dotate di riscaldamento a vapore e termosifoni originali restaurati e funzionanti." },
  { q: "Posso portare il mio cane a bordo?", a: "I cani di piccola taglia sono ammessi gratuitamente all'interno dell'apposito trasportino. I cani di taglia superiore necessitano di un biglietto dedicato." },
  { q: "Ci sono toilette a bordo?", a: "Sì, sebbene siano le originali degli anni '30. Suggeriamo di usufruire dei bagni presenti nelle stazioni di sosta per maggiore comodità." },
  { q: "Posso portare il pranzo al sacco?", a: "Assolutamente sì. Non è presente una carrozza ristorante, quindi il pranzo al sacco è benvenuto, specialmente da consumare durante le soste lunghe nei borghi." }
];

export default function InfoUtili() {
  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
       
       {/* Left Sticky Panel */}
       <div className="lg:col-span-5 h-full">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-32">
           <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-[-0.03em] mb-8 text-foreground">
             Info <span className="text-primary italic">utili</span>
           </h1>
           <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-[40ch]">
             Tutto quello che c'è da sapere prima di imbarcarsi in questa avventura retrò tra le montagne abruzzesi.
           </p>
           
           {/* Rules Card */}
           <div className="p-8 rounded-3xl bg-accent-warm/20 border border-accent-warm/30 shadow-[0_8px_24px_rgba(212,165,116,0.08)]">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-accent-warm/30 flex items-center justify-center">
                 <Warning size={20} className="text-wood" weight="fill" />
               </div>
               <h3 className="font-bold text-lg text-foreground">Regole a bordo</h3>
             </div>
             <p className="text-muted-foreground text-sm leading-relaxed">
               I treni storici richiedono attenzione. Non sporgersi dai finestrini durante la marcia, non gettare rifiuti dal treno, e mantenere comportamenti rispettosi dei materiali d'epoca e degli altri viaggiatori.
             </p>
           </div>
         </motion.div>
       </div>

       {/* FAQ Cards */}
       <div className="lg:col-span-7 flex flex-col gap-5" role="list" aria-label="Domande frequenti">
         {faq.map((item, i) => (
           <motion.article 
             key={i}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 22 }}
             className="bg-card p-8 rounded-3xl shadow-[0_8px_28px_rgba(107,158,126,0.08)] flex gap-5 group hover:shadow-[0_12px_36px_rgba(107,158,126,0.14)] hover:scale-[1.01] transition-all duration-300"
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
