import moment from 'moment';
import { withProps } from 'recompose';

import { setCommissionRates } from 'core/api/organisations/methodDefinitions';

export default withProps(({ organisationId }) => ({
  onSubmit: ({ type, rates }) =>
    setCommissionRates.run({
      organisationId,
      commissionRates: {
        type,
        rates: rates.map(({ startDate, ...rest }) => ({
          startDate: moment(startDate).format('MM-DD'),
          ...rest,
        })),
      },
    }),
}));
