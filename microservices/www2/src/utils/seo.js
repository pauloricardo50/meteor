const BASE_URL = 'https://www.e-potek.ch';

export const getPageTitle = ({ seoTitle, title, pageTitle }) =>
  seoTitle || `${title}${pageTitle ? ` | ${pageTitle}` : ''}`;

// Keep trailing slashes here, as netlify seems to add a 301 redirect from the
// non-trailing-slash version to the trailing-slash version
// Check facebook sharing debugger if this has been resolved, currently it
// shows the following:

// We could not resolve the canonical URL because the redirect path contained a cycle.
// Input URL	->	https://www.e-potek.ch/fr/blog/fiscalite-frais-acquisition-droits-mutation
// 301 HTTP Redirect	->	https://www.e-potek.ch/fr/blog/fiscalite-frais-acquisition-droits-mutation/
// og:url Meta Tag	->	https://www.e-potek.ch/fr/blog/fiscalite-frais-acquisition-droits-mutation

export const getOgUrl = (meta, lang) => {
  if (!meta) {
    if (lang === 'fr') {
      return `${BASE_URL}/fr/accueil/`;
    }

    // TODO: Add other languages here when the pages exist
    return BASE_URL;
  }

  if (meta?.type === 'post') {
    return `${BASE_URL}/${lang}/blog/${meta.uid}/`;
  }

  return `${BASE_URL}/${lang}/${meta.uid}/`;
};

export const getOgImage = pageObject => {
  if (pageObject?.seo_image?.url) {
    return {
      url: pageObject.seo_image.url,
      ...pageObject.seo_image.dimensions,
    };
  }
  let url;
  let dimensions;

  if (pageObject?.body?.[0]?.type === 'hero') {
    url =
      pageObject.body[0].primary?.image?.url ||
      pageObject.body[0].primary?.images?.url;
    dimensions =
      pageObject.body[0].primary?.image?.dimensions ||
      pageObject.body[0].primary?.images?.dimensions;
  }

  return {
    url: url || 'https://d2gb1cl8lbi69k.cloudfront.net/facebook-img.png',
    ...dimensions,
  };
};
