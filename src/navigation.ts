import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Corso Base',
      href: getPermalink('/corso-base'),
    },
    {
      text: 'Chi siamo',
      href: getPermalink('/chi-siamo'),
    },
    {
      text: 'Contatti',
      href: getPermalink('/contatti'),
    },
  ],
  actions: [
    { variant: 'primary' as const, text: 'Prenota la lezione di prova', href: getPermalink('/lezione-di-prova') },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Naviga',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'Corso Base', href: getPermalink('/corso-base') },
        { text: 'Chi siamo', href: getPermalink('/chi-siamo') },
        { text: 'Contatti', href: getPermalink('/contatti') },
      ],
    },
    {
      title: 'Contatti',
      links: [
        {
          text: 'Via Grasso Finocchiaro 63, Catania',
          href: 'https://www.google.com/maps/search/?api=1&query=Via+Grasso+Finocchiaro+63+Catania',
        },
        { text: 'info@saladarmimarea.it', href: 'mailto:info@saladarmimarea.it' },
        { text: '+39 340 149 6622', href: 'tel:+393401496622' },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/SchermaStoricaCataniaReal',
    },
    {
      ariaLabel: 'Instagram',
      icon: 'tabler:brand-instagram',
      href: 'https://www.instagram.com/scherma_storica_catania_marea/',
    },
    {
      ariaLabel: 'YouTube',
      icon: 'tabler:brand-youtube',
      href: 'https://www.youtube.com/@GiuseppePioletti',
    },
  ],
  footNote: `© 2026 Sala d'armi Marea ASD. Tutti i diritti riservati`,
};
