import { useEffect, useMemo, useRef } from 'react';

const TRIPADVISOR_URL =
  'https://www.tripadvisor.it/Attraction_Review-g194928-d12914784-Reviews-Transiberiana_d_Italia-Sulmona_Province_of_L_Aquila_Abruzzo.html';

export default function TripAdvisorReviews() {
  const scriptRef = useRef(null);

  const widget = useMemo(() => {
    const locationId = 12914784;
    const wtype = 'cdsscrollingravewide';
    const uniq = 1291;
    const lang = 'it';

    return {
      locationId,
      wtype,
      uniq,
      lang,
      containerId: `TA_${wtype}${uniq}`,
      className: `TA_${wtype}`,
      scriptSrc: `https://www.jscache.com/wejs?wtype=${wtype}&uniq=${uniq}&locationId=${locationId}&lang=${lang}&border=true&shadow=true&display_version=2`,
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    const script = document.createElement('script');
    script.src = widget.scriptSrc;
    script.async = true;
    script.setAttribute('data-ta-widget', widget.containerId);
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [widget]);

  return (
    <section className="px-6 md:px-12 lg:px-20 pb-20" aria-label="Recensioni TripAdvisor">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Recensioni</h2>
            <p className="text-muted-foreground mt-1">
              Estratto ufficiale da TripAdvisor.
            </p>
          </div>
          <a
            href={TRIPADVISOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-card border border-border/60 text-foreground font-semibold hover:shadow-[var(--shadow-card)] transition-all duration-300"
          >
            Vedi tutte su TripAdvisor
          </a>
        </div>

        <div className="bg-card rounded-3xl p-4 md:p-6 shadow-[var(--shadow-card)] border border-border/40 overflow-hidden">
          <div id={widget.containerId} className={widget.className}>
            <ul className="list-none m-0 p-0">
              <li className="m-0 p-0">
                <a href={TRIPADVISOR_URL} target="_blank" rel="noopener noreferrer">
                  TripAdvisor
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

