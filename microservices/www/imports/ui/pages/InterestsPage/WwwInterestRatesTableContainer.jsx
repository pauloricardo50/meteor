import { withProps, compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import currentInterestRates from 'core/api/interestRates/queries/currentInterestRates';
import { columnOptions, rows } from './wwwInterestsTableHelpers';

export const WwwInterestsTableContainer = compose(
  withSmartQuery({
    query: currentInterestRates,
    queryOptions: { reactive: true },
    dataName: 'currentInterestRates',
    smallLoader: true,
  }),
  withProps(props => ({
    ...props,
    columnOptions,
    rows: rows(props.currentInterestRates.rates),
    date: props.currentInterestRates.date,
  })),
);

export default WwwInterestsTableContainer;
