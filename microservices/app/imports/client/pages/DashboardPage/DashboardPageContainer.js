import {
  branch,
  compose,
  mapProps,
  renderComponent,
  withState,
} from 'recompose';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';

import WelcomeScreen from '../../components/WelcomeScreen';
import SimpleDashboardPage from '../SimpleDashboardPage';

export default compose(
  // Use this state to rerender when changing window.hideWelcomeScreen
  withState('rerenderState', 'rerender', false),
  branch(
    ({ loan }) => loan.displayWelcomeScreen && !window.hideWelcomeScreen,
    renderComponent(WelcomeScreen),
  ),
  mapProps(({ rerenderState, rerender, ...props }) => props),
  branch(
    ({ loan }) => loan.applicationType === APPLICATION_TYPES.SIMPLE,
    renderComponent(SimpleDashboardPage),
  ),
);
