import { withProps } from 'recompose';
import moment from 'moment';

import { setCommissionRates } from 'core/api/methods';

export default withProps(({ organisationId }) => ({
  onSubmit: ({ type, rates }) =>
    setCommissionRates.run({
      organisationId,
      commissionRates: {
        type,
        rates: rates.map(({ date, ...rest }) => ({
          date: moment(date).format('MM-DD'),
          ...rest,
        })),
      },
    }),
}));
