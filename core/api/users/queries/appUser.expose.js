import query from './appUser';

query.expose({
  firewall(userId, params) {
    params.userId = userId;
  },
  embody: {
    // This will deepExtend your body
    $filter({ filters, params }) {
      filters._id = params.userId;
    },
  },
  validateParams: {},
});
