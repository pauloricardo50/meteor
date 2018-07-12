import { createContainer } from 'core/api';

import { columnOptions, rows } from './adminInterestsTableHelpers';

export const AdminInterestsTableContainer = createContainer(props => ({
  ...props,
  columnOptions,
  rows,
}));

export default AdminInterestsTableContainer;
