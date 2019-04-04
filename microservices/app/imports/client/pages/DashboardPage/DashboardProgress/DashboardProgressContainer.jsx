import { withRouter } from 'react-router-dom';
import { withProps, compose } from 'recompose';

export default compose(
  withRouter,
  withProps(({ loan }) => ({ currentStep: loan.step })),
);
