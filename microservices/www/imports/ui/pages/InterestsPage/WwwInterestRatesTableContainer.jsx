import { createContainer } from 'core/api';

import { columnOptions, rows } from './wwwInterestsTableHelpers';

export const WwwInterestsTableContainer = createContainer(props => ({
  ...props,
  columnOptions,
  rows,
}));

export default WwwInterestsTableContainer;
