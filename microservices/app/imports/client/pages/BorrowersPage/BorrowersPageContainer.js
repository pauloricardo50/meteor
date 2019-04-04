import { compose, branch, renderComponent } from 'recompose';

import withMatchParam from 'core/containers/withMatchParam';
import { APPLICATION_TYPES } from 'core/api/constants';
import SimpleBorrowersPage from '../SimpleBorrowersPage';

export default compose(
  withMatchParam('tabId'),
  branch(
    ({ loan }) => loan.applicationType === APPLICATION_TYPES.SIMPLE,
    renderComponent(SimpleBorrowersPage),
  ),
);
