const setupRedirects = ({ actions: { createRedirect } }) => {
  createRedirect({ fromPath: '/', toPath: '/fr' });
  // createRedirect({ fromPath: '/about', toPath: '/fr/a-propos', Language: 'fr' });
};

export default setupRedirects;
