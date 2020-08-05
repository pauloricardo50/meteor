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
