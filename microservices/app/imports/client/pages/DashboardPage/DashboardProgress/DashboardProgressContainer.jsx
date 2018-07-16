import { withRouter } from 'react-router-dom';
import { createContainer, compose } from 'core/api/containerToolkit';
import getSteps from 'core/arrays/steps';

export default compose(
  withRouter,
  createContainer(({ loan }) => {
    const steps = getSteps();

    return { steps, currentStep: loan.logic.step };
  }),
);
