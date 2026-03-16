import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import ImageCredit from './ImageCredit';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const CITIES = [
  {
    id: 'sulmona',
    name: 'Sulmona',
    description: 'Città d\'arte, patria di Ovidio. Punto di partenza della Transiberiana.',
    progress: 0.2,
    imageId: '1506260408121-e353d10b87c7'
  },
  {
    id: 'castel-di-sangro',
    name: 'Castel di Sangro',
    description: 'Il cuore della Valle del Sangro. Meta strategica dell\'Appennino.',
    progress: 0.5,
    imageId: '1475924156734-496f6cac6ec1'
  },
  {
    id: 'isernia',
    name: 'Isernia',
    description: 'Termine della linea. Città longobarda con un ricco patrimonio storico.',
    progress: 0.8,
    imageId: '1465146344425-f00d5f5c8f07'
  }
];

const ZONE_SIZE = 0.08;
const EXIT_HYSTERESIS = 0.06;

export default function ScrollTelling() {
  const containerRef = useRef(null);
  const trainRef = useRef(null);
  const pathRef = useRef(null);
  const [activeCity, setActiveCity] = useState(null);
  const lastProgressRef = useRef(0);
  const enteredCityRef = useRef(null);

  const checkActiveCity = useCallback((progress) => {
    const isScrollingDown = progress >= lastProgressRef.current;
    lastProgressRef.current = progress;
    
    let foundCity = null;
    
    for (const city of CITIES) {
      const zoneStart = city.progress - ZONE_SIZE / 2;
      const zoneEnd = city.progress + ZONE_SIZE / 2;
      
      if (progress >= zoneStart && progress <= zoneEnd) {
        if (isScrollingDown) {
          if (progress >= city.progress - ZONE_SIZE / 4) {
            foundCity = city.id;
            enteredCityRef.current = city.id;
          }
        } else {
          if (progress <= city.progress + ZONE_SIZE / 4) {
            foundCity = city.id;
            enteredCityRef.current = city.id;
          }
        }
        break;
      }
    }
    
    if (!foundCity && enteredCityRef.current) {
      const enteredCity = CITIES.find(c => c.id === enteredCityRef.current);
      if (enteredCity) {
        const exitThreshold = isScrollingDown 
          ? enteredCity.progress + ZONE_SIZE / 2 + EXIT_HYSTERESIS
          : enteredCity.progress - ZONE_SIZE / 2 - EXIT_HYSTERESIS;
        
        if ((isScrollingDown && progress > exitThreshold) || 
            (!isScrollingDown && progress < exitThreshold)) {
          enteredCityRef.current = null;
        } else {
          foundCity = enteredCity.id;
        }
      }
    }
    
    setActiveCity(foundCity);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const train = trainRef.current;
      const container = containerRef.current;

      if (!path || !train || !container) return;

      const pathLength = path.getTotalLength();

      gsap.set(train, {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 0
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            checkActiveCity(self.progress);
          }
        }
      });

      tl.to(train, {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1
        },
        duration: 1,
        ease: 'none'
      });

      CITIES.forEach((city, index) => {
        const popup = document.getElementById(`popup-${city.id}`);
        if (!popup) return;

        const triggerProgress = city.progress;
        
        gsap.fromTo(popup, 
          { opacity: 0, x: city.progress < 0.5 ? -20 : 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            scrollTrigger: {
              trigger: container,
              start: `top ${100 - (triggerProgress * 100)}%`,
              end: `top ${100 - (triggerProgress * 100) - 5}%`,
              toggleActions: 'play reverse play reverse',
              scrub: 0.5
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, [checkActiveCity]);

  return (
    <div ref={containerRef} className="relative min-h-[300vh]">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 300"
        preserveAspectRatio="none"
        style={{ position: 'absolute', height: '300vh', width: '100%', zIndex: 1 }}
      >
        <defs>
          <linearGradient id="trackGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-light)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--primary-light)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        <path
          ref={pathRef}
          id="trackPath"
          d="M 50 0 
             C 30 15, 70 30, 50 45 
             C 30 60, 70 75, 50 90 
             C 30 105, 70 120, 50 135 
             C 30 150, 70 165, 50 180 
             C 30 195, 70 210, 50 225 
             C 30 240, 70 255, 50 270 
             C 30 285, 70 300, 50 300"
          fill="none"
          stroke="url(#trackGradient)"
          strokeWidth="2"
          strokeDasharray="8 4"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 3px rgba(107, 158, 126, 0.3))' }}
        />
      </svg>

      <div
        ref={trainRef}
        className="fixed top-1/2 left-1/2 z-20 pointer-events-none"
        style={{ 
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="drop-shadow-lg">
          <circle cx="24" cy="24" r="20" fill="var(--primary)" fillOpacity="0.15" />
          <circle cx="24" cy="24" r="14" fill="var(--primary)" fillOpacity="0.3" />
          <path 
            d="M24 10 L32 28 L24 24 L16 28 L24 10Z" 
            fill="var(--primary)"
            stroke="var(--foreground)"
            strokeWidth="1"
          />
          <circle cx="24" cy="32" r="4" fill="var(--wood)" stroke="var(--foreground)" strokeWidth="1" />
          <rect x="22" y="18" width="4" height="6" fill="var(--foreground)" fillOpacity="0.5" rx="1" />
        </svg>
      </div>

      {CITIES.map((city) => (
        <div
          key={city.id}
          id={`popup-${city.id}`}
          className={`fixed z-10 transition-opacity duration-300 ${
            activeCity === city.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            top: `${city.progress * 100 + 15}%`,
            [city.progress < 0.5 ? 'left' : 'right']: '5%',
            maxWidth: '280px',
            willChange: 'opacity, transform'
          }}
        >
          <div 
            className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(107,158,126,0.15)]"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(107, 158, 126, 0.15)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img 
                  src={`https://images.unsplash.com/photo-${city.imageId}?w=80&h=80&auto=format&fit=crop`}
                  alt={city.name}
                  className="w-full h-full object-cover"
                />
                <ImageCredit
                  src={`https://images.unsplash.com/photo-${city.imageId}?w=80&h=80&auto=format&fit=crop`}
                  className="absolute bottom-0 right-0 rounded-full bg-black/60 px-1.5 py-0.5 text-[8px] text-white/90"
                  linkClassName="text-white/90 hover:text-white"
                />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">{city.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{city.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
