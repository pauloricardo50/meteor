const BASE_URL = 'https://www.e-potek.ch';

export const getPageTitle = ({ seoTitle, title, pageTitle }) =>
  seoTitle || `${title}${pageTitle ? ` | ${pageTitle}` : ''}`;

export const getOgUrl = (meta, lang) => {
  if (!meta) {
    if (lang === 'fr') {
      return `${BASE_URL}/fr/accueil`;
    }

    // TODO: Add other languages here when the pages exist
    return BASE_URL;
  }

  if (meta?.type === 'post') {
    return `${BASE_URL}/${lang}/blog/${meta.uid}`;
  }

  return `${BASE_URL}/${lang}/${meta.uid}`;
};
