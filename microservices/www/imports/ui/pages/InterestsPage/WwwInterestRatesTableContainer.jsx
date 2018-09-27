import { withProps } from 'recompose';

import { columnOptions, rows } from './wwwInterestsTableHelpers';

export const WwwInterestsTableContainer = withProps(props => ({
  ...props,
  columnOptions,
  rows,
}));

export default WwwInterestsTableContainer;
