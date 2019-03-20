import Organisations from '..';
import filesReducer from '../../reducers/filesReducer';
import RevenueService from '../../revenues/server/RevenueService';

Organisations.addReducers({
  ...filesReducer,
  generatedRevenues: {
    body: { _id: 1 },
    reduce: ({ _id: organisationId }) =>
      RevenueService.getGeneratedRevenues({ organisationId }),
  },
});
