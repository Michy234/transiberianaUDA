import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function TimelineItem({ year, title, desc, reverse, imageId }) {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between w-full mb-24 gap-8 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full md:w-5/12"
      >
        <div className="text-primary font-serif text-3xl font-bold mb-4 italic">{year}</div>
        <h3 className="text-3xl font-bold tracking-tight mb-4 text-foreground">{title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">{desc}</p>
      </motion.div>
      
      {/* Timeline dot */}
      <div className="w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center shrink-0 z-10 hidden md:flex shadow-[0_4px_12px_rgba(107,158,126,0.15)]">
         <div className="w-3 h-3 rounded-full bg-primary" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        className="w-full md:w-5/12 aspect-[4/3] rounded-3xl bg-secondary overflow-hidden shadow-[0_12px_32px_rgba(107,158,126,0.1)]"
      >
         <img 
           src={`https://images.unsplash.com/photo-${imageId}?q=80&w=1200&auto=format&fit=crop`} 
           alt={`${title} - ${year}`} 
           className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
           loading="lazy"
         />
      </motion.div>
    </div>
  );
}

export default function Storia() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-[100dvh] bg-background relative selection:bg-primary/20">
      
      {/* Scroll progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif font-bold tracking-[-0.03em] mb-8 text-foreground"
        >
          Un secolo di <span className="italic text-primary/70">storia</span> attraverso gli Appennini
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground leading-relaxed max-w-[60ch] mx-auto"
        >
          Progettata a fine Ottocento, la ferrovia Sulmona-Isernia è un capolavoro di ingegneria civile che ha unito le popolazioni montane prima di diventare la linea turistica più iconica d'Italia.
        </motion.p>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative">
        <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-0.5 bg-border -translate-x-1/2 hidden md:block" aria-hidden="true" />
        
        <TimelineItem 
          year="1892" 
          title="L'inizio dei lavori" 
          desc="Iniziano i lavori per la costruzione della Sulmona-Isernia. La sfida ingegneristica è colossale: bisogna superare dislivelli enormi scavando gallerie nella roccia viva dell'Appennino."
          reverse={false}
          imageId="1474487548417-781cb71495f3"
        />
        
        <TimelineItem 
          year="1897" 
          title="L'inaugurazione" 
          desc="Viene inaugurato il tratto fino a Cansano e Campo di Giove. La ferrovia diventa subito il principale mezzo di trasporto per merci e persone tra l'Abruzzo e il Molise."
          reverse={true}
          imageId="1506260408121-e353d10b87c7"
        />
        
        <TimelineItem 
          year="1943" 
          title="Distruzione e rinascita" 
          desc="Durante la Seconda Guerra Mondiale la linea subisce gravissimi danni a causa della Linea Gustav. Negli anni '50 viene ricostruita e ammodernata, riprendendo il suo ruolo di collante vitale."
          reverse={false}
          imageId="1475924156734-496f6cac6ec1"
        />
        
        <TimelineItem 
          year="2011" 
          title="La sospensione" 
          desc="Il servizio ordinario passeggeri viene sospeso per via degli elevati costi di gestione. Si teme l'abbandono definitivo della linea storica."
          reverse={true}
          imageId="1465146344425-f00d5f5c8f07"
        />

        <TimelineItem 
          year="Oggi" 
          title="La Transiberiana" 
          desc="Rinata come ferrovia turistica grazie alla Fondazione FS Italiane, oggi offre l'esperienza magica di viaggiare su treni d'epoca attraverso i paesaggi immacolati dell'Appennino."
          reverse={false}
          imageId="1494515843206-f3117d3f51b7"
        />
        
      </section>

    </div>
  );
}
