import React from 'react';
import { useI18n } from '../i18n/index.jsx';
import LegalPageLayout from '../components/legal/LegalPageLayout';

export default function LegalNotice() {
  const { lang } = useI18n();
  const isItalian = lang === 'it';

  const meta = isItalian
    ? [
        { label: 'Affiliazione', value: 'Il sito non dichiara alcuna affiliazione ufficiale con i marchi o gli enti citati.' },
        { label: 'Pubblicazione', value: 'Demo tecnica pubblicata tramite Vercel.' },
        { label: 'Servizi attivi', value: 'Nessun servizio di prenotazione, newsletter o vendita è gestito dal sito demo.' },
      ]
    : [
        { label: 'Affiliation', value: 'The website does not claim any official affiliation with the brands or entities mentioned.' },
        { label: 'Publication', value: 'Technical demo published through Vercel.' },
        { label: 'Active services', value: 'No booking, newsletter, or sales service is operated by the demo website.' },
      ];

  const sections = isItalian
    ? [
        {
          title: 'Avvertenza generale',
          paragraphs: [
            'Questo sito è una demo scolastica non ufficiale costruita a fini didattici. I contenuti hanno finalità di studio, prototipazione e sperimentazione.',
            'Il sito non sostituisce le informazioni pubblicate dai soggetti ufficiali eventualmente citati nelle pagine.',
          ],
        },
        {
          title: 'Marchi, nomi e riferimenti del progetto',
          paragraphs: [
            'I nomi, i loghi e i riferimenti visivi eventualmente mostrati nel progetto restano di proprietà dei rispettivi titolari.',
            'La loro presenza in questa demo non deve essere interpretata come partnership commerciale, sponsorizzazione o affiliazione ufficiale del progetto scolastico.',
          ],
        },
        {
          title: 'Immagini, fonti e crediti',
          paragraphs: [
            'Le immagini locali usate nel progetto riportano crediti e fonti ove disponibili. Le licenze note sono documentate nei file di supporto del progetto.',
            'Le immagini importate localmente dalla home e dagli altri percorsi mostrano un credito sintetico quando il file sorgente è riconosciuto, così da mantenere la tracciabilità anche sugli asset di progetto.',
            'La demo utilizza inoltre font auto-ospitati con lo stesso aspetto visivo della versione precedente, così da ridurre il caricamento di risorse da terze parti.',
          ],
        },
        {
          title: 'Dati e servizi esterni',
          list: [
            'Open-Meteo è usato per i dati della sezione meteo live.',
            'Google Maps, Trainline e TripAdvisor vengono aperti come servizi esterni solo su iniziativa dell\'utente.',
            'L\'hosting della demo è indicato come Vercel.',
          ],
        },
        {
          title: 'Fonti normative consultate per questa demo',
          list: [
            'Regolamento (UE) 2016/679 - GDPR.',
            'Direttiva 2002/58/CE - ePrivacy.',
            'D.lgs. 196/2003, art. 122 - Codice Privacy italiano.',
            'FAQ e linee guida cookie del Garante per la protezione dei dati personali.',
            'Guidelines 2/2023 dell\'European Data Protection Board sul perimetro tecnico dell\'art. 5(3) ePrivacy.',
          ],
          note: 'Nel repository è presente anche un dossier in Markdown con checklist e fonti commentate, utile per il contesto scolastico e di revisione del progetto.',
        },
      ]
    : [
        {
          title: 'General notice',
          paragraphs: [
            'This website is an unofficial school demo created for educational purposes. Its contents are meant for study, prototyping, and experimentation.',
            'The website does not replace the information published by any official subjects mentioned in the pages.',
          ],
        },
        {
          title: 'Brands, names, and project references',
          paragraphs: [
            'Any names, logos, and visual references shown in the project remain the property of their respective owners.',
            'Their presence in this demo must not be interpreted as a commercial partnership, sponsorship, or official affiliation of the school project.',
          ],
        },
        {
          title: 'Images, sources, and credits',
          paragraphs: [
            'Local images used in the project include credits and sources whenever available. Known licenses are documented in the project support files.',
            'The demo also uses self-hosted fonts with the same visual appearance as the previous version, reducing third-party resource loading.',
          ],
        },
        {
          title: 'Data and external services',
          list: [
            'Open-Meteo is used for the live weather section.',
            'Google Maps, Trainline, and TripAdvisor are opened as external services only when the user chooses to do so.',
            'The demo hosting is indicated as Vercel.',
          ],
        },
        {
          title: 'Regulatory sources consulted for this demo',
          list: [
            'Regulation (EU) 2016/679 - GDPR.',
            'Directive 2002/58/EC - ePrivacy.',
            'Italian Privacy Code, Article 122.',
            'Cookie FAQs and guidelines issued by the Italian Data Protection Authority.',
            'EDPB Guidelines 2/2023 on the technical scope of Article 5(3) of the ePrivacy Directive.',
          ],
          note: 'The repository also includes a Markdown dossier with a checklist and annotated sources, useful for the school review context of this project.',
        },
      ];

  return (
    <LegalPageLayout
      badge={isItalian ? 'Note legali' : 'Legal notice'}
      title={isItalian ? 'Note legali, crediti e licenze' : 'Legal notice, credits, and licenses'}
      intro={
        isItalian
          ? 'Questa pagina chiarisce la natura dimostrativa del progetto, i riferimenti usati e i limiti della pubblicazione attuale.'
          : 'This page explains the demonstrative nature of the project, the references used, and the limits of the current publication.'
      }
      meta={meta}
      sections={sections}
    />
  );
}
