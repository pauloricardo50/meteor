const setupRedirects = ({ actions: { createRedirect } }) => {
  createRedirect({ fromPath: '/', toPath: '/fr' });
  // createRedirect({ fromPath: '/', toPath: '/en', Language: 'en' });
};

export default setupRedirects;
