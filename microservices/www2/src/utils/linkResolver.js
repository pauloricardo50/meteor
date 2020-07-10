// -- The Link Resolver
// This function will be used to generate links to Prismic documents

export const linkResolver = doc => {
  const { lang, type, uid } = doc;

  const shortLang = { 'fr-ch': 'fr', 'en-us': 'en' }[lang];
  const resolvedLink = {
    post: `/${shortLang}/blog/${uid}`,
    page: `/${shortLang}/${uid}`,
  }[type];

  return resolvedLink || '/';
};
