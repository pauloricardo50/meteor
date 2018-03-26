import { withRouter } from 'react-router-dom';
import { createContainer, compose } from 'core/api/containerToolkit';
import getSteps from 'core/arrays/steps';

export default compose(
  withRouter,
  createContainer(({ loan, borrowers, property }) => {
    const steps = getSteps({ loan, borrowers, property });
    const nextItem = steps[loan.logic.step].items.find(subStep => !subStep.isDone());

    return {
      steps,
      currentStep: loan.logic.step,
      currentLink: nextItem && nextItem.link,
      currentItemId: nextItem.id,
    };
  }),
);
