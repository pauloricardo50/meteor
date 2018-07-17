import query from './userLoan';

query.expose({
  firewall() {
    // This query only returns data for the logged in user, so no need
    // for a firewall
    // It's done to be able to wrap the appLayout with this query at all
    // times, even for logged out pages
  },
});
