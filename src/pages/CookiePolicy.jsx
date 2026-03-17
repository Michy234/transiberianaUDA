import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import LegalPageLayout from '../components/legal/LegalPageLayout';

export default function CookiePolicy() {
  const { lang } = useI18n();
  const isItalian = lang === 'it';

  const meta = isItalian
    ? [
        { label: 'Profilazione', value: 'Non attiva in questa demo.' },
        { label: 'Analytics', value: 'Non attivi in questa demo.' },
        { label: 'Strumenti tecnici', value: 'Tema, lingua e chiusura avviso informativo.' },
      ]
    : [
        { label: 'Profiling', value: 'Not active in this demo.' },
        { label: 'Analytics', value: 'Not active in this demo.' },
        { label: 'Technical tools', value: 'Theme, language, and dismissal of the informational notice.' },
      ];

  const sections = isItalian
    ? [
        {
          title: 'Stato attuale della demo',
          paragraphs: [
            'Alla data di questo aggiornamento la demo non utilizza cookie di profilazione e non attiva strumenti analytics di terze parti.',
            'Il sito utilizza solo strumenti tecnici locali strettamente legati al funzionamento della demo e alle preferenze richieste dall\'utente.',
          ],
        },
        {
          title: 'Strumenti tecnici attualmente usati',
          list: [
            'transiberiana-theme: memorizza il tema chiaro o scuro scelto dall\'utente.',
            'lang: memorizza la lingua dell\'interfaccia selezionata dall\'utente.',
            'transiberiana-cookie-notice-dismissed: memorizza la chiusura dell\'avviso informativo sulla policy.',
          ],
        },
        {
          title: 'Cosa non viene usato',
          list: [
            'Nessun banner di marketing basato su profilazione.',
            'Nessun cookie analytics di terze parti caricato automaticamente.',
            'Nessun pixel pubblicitario.',
            'Nessun modulo attivo che memorizzi email o dati personali nel browser.',
          ],
        },
        {
          title: 'Servizi esterni aperti solo su iniziativa dell\'utente',
          paragraphs: [
            'Alcune sezioni del sito possono contenere collegamenti verso servizi esterni, per esempio Google Maps, Trainline o TripAdvisor.',
            'Questi servizi non vengono caricati automaticamente come embed persistenti: l\'utente li apre solo con una scelta esplicita.',
          ],
        },
        {
          title: 'Come gestire le preferenze locali',
          paragraphs: [
            'Le preferenze possono essere azzerate cancellando i dati del browser oppure cambiando direttamente tema e lingua dal sito.',
            'L\'avviso informativo puo essere nuovamente visualizzato cancellando i dati del browser associati al sito.',
          ],
          note: 'Se in futuro il progetto aggiungera analytics, mappe incorporate o altri strumenti non strettamente necessari, questa policy e il relativo banner dovranno essere aggiornati prima della pubblicazione.',
        },
      ]
    : [
        {
          title: 'Current demo status',
          paragraphs: [
            'At the time of this update the demo does not use profiling cookies and does not enable third-party analytics tools.',
            'The website only uses local technical tools that are strictly connected to the functioning of the demo and to preferences explicitly requested by the user.',
          ],
        },
        {
          title: 'Technical tools currently in use',
          list: [
            'transiberiana-theme: stores the light or dark theme selected by the user.',
            'lang: stores the interface language selected by the user.',
            'transiberiana-cookie-notice-dismissed: stores dismissal of the informational policy notice.',
          ],
        },
        {
          title: 'What is not in use',
          list: [
            'No profiling-based marketing banner.',
            'No third-party analytics cookies loaded automatically.',
            'No advertising pixel.',
            'No active form storing email or personal data in the browser.',
          ],
        },
        {
          title: 'External services opened only on user action',
          paragraphs: [
            'Some sections of the website may include links to external services, such as Google Maps, Trainline, or TripAdvisor.',
            'These services are not automatically loaded as persistent embeds: the user opens them only through an explicit choice.',
          ],
        },
        {
          title: 'How to manage local preferences',
          paragraphs: [
            'Preferences can be reset by clearing browser data or by changing theme and language directly on the site.',
            'The informational notice can be shown again by clearing the browser data associated with the site.',
          ],
          note: 'If the project later adds analytics, embedded maps, or other non-strictly-necessary tools, this policy and the related notice must be updated before publication.',
        },
      ];

  return (
    <LegalPageLayout
      badge={isItalian ? 'Cookie e preferenze' : 'Cookies and preferences'}
      title={isItalian ? 'Cookie Policy' : 'Cookie Policy'}
      intro={
        isItalian
          ? 'Questa pagina descrive in modo trasparente gli strumenti tecnici e le preferenze locali attualmente usati dalla demo.'
          : 'This page transparently describes the technical tools and local preferences currently used by the demo.'
      }
      meta={meta}
      sections={sections}
    />
  );
}
