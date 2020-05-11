// -- The Link Resolver
// This function will be used to generate links to Prismic documents

exports.linkResolver = function linkResolver(doc) {
  const { lang, type, uid } = doc;

  const shortLang = {
    'fr-ch': 'fr',
    'en-us': 'en',
  }[lang];

  const resolvedLink = {
    post: `/${shortLang}/blog/${uid}`,
    page: `/${shortLang}/${uid}`,
  }[type];

  // TODO: default may not be root, depending upon how localized homepages are configured
  return resolvedLink || '/';
};
