import { branch, renderComponent } from 'recompose';
import { APPLICATION_TYPES } from 'core/api/constants';
import SimpleDashboardPage from '../SimpleDashboardPage';

export default branch(
  ({ loan }) => loan.applicationType === APPLICATION_TYPES.SIMPLE,
  renderComponent(SimpleDashboardPage),
);
