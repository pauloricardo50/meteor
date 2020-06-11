import languages from '../config/languages';

const getFinalSlug = slug => {
  // This is used in contentful to allow our home page
  // to not have a slug
  if (slug === 'NO_SLUG') {
    return '';
  }

  // Prefix with a "/" to allow the home page to not have
  // a trailing "/"
  return `/${slug}`;
};

const getLanguage = node_locale => node_locale.split('-')[0];

const getPagePath = ({ language, prefix, slug }) => {
  const finalSlug = getFinalSlug(slug);

  if (prefix) {
    return `/${language}/${prefix}${finalSlug}`;
  }

  return `/${language}${finalSlug}`;
};

const getTranslationPaths = (page, pages) => {
  const { contentful_id } = page;
  const identicalPages = pages
    .filter(p => p.contentful_id === contentful_id)
    .map(obj => ({
      ...obj,
      language: getLanguage(obj.node_locale),
    }));

  return languages.reduce(
    (obj, lang) => ({
      ...obj,
      [lang]: getPagePath({
        ...identicalPages.find(({ language }) => language === lang),
        language: lang,
      }),
    }),
    {},
  );
};

const getPageContext = ({ page, pages, prefix }) => {
  const { id, node_locale, slug } = page;
  const language = getLanguage(node_locale);
  const i18n = getTranslationPaths(page, pages);
  console.log('i18n:', i18n);

  return {
    path: getPagePath({ language, prefix, slug }),
    context: { id, i18n },
  };
};

export default getPageContext;
