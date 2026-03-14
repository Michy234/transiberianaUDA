import React from 'react';
import { motion } from 'framer-motion';
import { Info, Question, Warning, MapTrifold } from '@phosphor-icons/react';

const faq = [
  { q: "Il treno è riscaldato in inverno?", a: "Sì, tutte le carrozze d'epoca sono dotate di riscaldamento a vapore e termosifoni originali restaurati e funzionanti." },
  { q: "Posso portare il mio cane a bordo?", a: "I cani di piccola taglia sono ammessi gratuitamente all'interno dell'apposito trasportino. I cani di taglia superiore necessitano di un biglietto dedicato." },
  { q: "Ci sono toilette a bordo?", a: "Sì, sebbene siano le originali degli anni '30. Suggeriamo di usufruire dei bagni presenti nelle stazioni di sosta per maggiore comodità." },
  { q: "Posso portare il pranzo al sacco?", a: "Assolutamente sì. Non è presente una carrozza ristorante, quindi il pranzo al sacco è benvenuto, specialmente da consumare durante le soste lunghe nei borghi." }
];

export default function InfoUtili() {
  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
       
       <div className="lg:col-span-5 h-full">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-32">
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-foreground">Info<span className="text-primary italic">Utili</span></h1>
           <p className="text-xl text-foreground/70 leading-relaxed mb-12">Tutto quello che c'è da sapere prima di imbarcarsi in questa avventura retrò tra le montagne abruzzesi.</p>
           
           <div className="p-8 rounded-[2rem] bg-secondary border border-border">
             <div className="flex items-center gap-3 mb-4">
               <Warning size={24} className="text-amber-500" weight="duotone" />
               <h3 className="font-bold text-lg">Regole a bordo</h3>
             </div>
             <p className="text-foreground/70 text-sm leading-relaxed">I treni storici richiedono attenzione. Non sporgersi dai finestrini durante la marcia, non gettare rifiuti dal treno, e mantenere comportamenti rispettosi dei materiali d'epoca e degli altri viaggiatori.</p>
           </div>
         </motion.div>
       </div>

       <div className="lg:col-span-7 flex flex-col gap-6">
         {faq.map((item, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-card border border-border p-8 rounded-[2rem] shadow-sm flex gap-6 group hover:border-primary/50 transition-colors"
           >
             <div className="w-12 h-12 rounded-full bg-secondary text-foreground/50 shrink-0 flex items-center justify-center inline-flex">
               <Question size={24} weight="duotone" />
             </div>
             <div>
               <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">{item.q}</h3>
               <p className="text-foreground/70 leading-relaxed">{item.a}</p>
             </div>
           </motion.div>
         ))}
       </div>

    </div>
  );
}
