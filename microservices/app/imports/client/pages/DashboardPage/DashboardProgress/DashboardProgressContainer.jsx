import { withRouter } from 'react-router-dom';
import { createContainer, compose } from 'core/api/containerToolkit';

export default compose(
  withRouter,
  createContainer(({ loan }) => ({ currentStep: loan.logic.step })),
);
