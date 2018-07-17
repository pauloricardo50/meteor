import query from './appUser';

query.expose({
  firewall() {
    // Only logged in user data
  },
});
