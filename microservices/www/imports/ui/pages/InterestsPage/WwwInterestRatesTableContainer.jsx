import { withProps, compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { currentInterestRates } from 'core/api/interestRates/queries';
import { columnOptions, rows } from './wwwInterestsTableHelpers';

export const WwwInterestsTableContainer = compose(
  withSmartQuery({
    query: currentInterestRates,
    // Don't make this reactive, there is a weird SSR issue with meteor
    // https://forums.meteor.com/t/solved-need-help-with-server-render-and-withtracker/41337/5
    queryOptions: { reactive: false },
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

export const WwwInterestsTableContainerForTests = withProps(props => ({
  ...props,
  columnOptions,
  rows: rows(props.currentInterestRates.rates),
  date: props.currentInterestRates.date,
}));
