import query from './proUser';

query.expose({
  firewall() {
    // Only logged in user data
  },
});
