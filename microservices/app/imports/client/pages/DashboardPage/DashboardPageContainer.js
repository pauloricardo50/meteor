import {
  compose,
  branch,
  renderComponent,
  withState,
  mapProps,
} from 'recompose';
import { APPLICATION_TYPES } from 'core/api/constants';
import SimpleDashboardPage from '../SimpleDashboardPage';
import WelcomeScreen from '../../components/WelcomeScreen';

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
