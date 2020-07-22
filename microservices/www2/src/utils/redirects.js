const redirects = [
  { fromPath: '/about', toPath: '/fr/a-propos', isPermanent: true },
  { fromPath: '/contact', toPath: '/fr/accueil', isPermanent: true },
  {
    fromPath: '/interests',
    toPath: '/fr/taux-hypothecaires',
    isPermanent: true,
  },
  { fromPath: '/careers', toPath: '/fr/accueil', isPermanent: true },
  { fromPath: '/faq', toPath: '/fr/faq', isPermanent: true },
  { fromPath: '/blog', toPath: '/fr/blog', isPermanent: true },
];

exports.redirects = redirects;
