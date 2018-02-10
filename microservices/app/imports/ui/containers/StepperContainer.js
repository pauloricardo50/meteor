import { connect } from 'react-redux';
import stepperActions from '../redux/actions/stepper';

const StepperContainer = component =>
  connect(({ stepper: { activeStep } }) => ({ activeStep }), stepperActions)(component);

export default StepperContainer;
