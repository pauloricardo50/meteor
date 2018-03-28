import { withRouter } from 'react-router-dom';
import { createContainer, compose } from 'core/api/containerToolkit';
import getSteps from 'core/arrays/steps';

export default compose(
  withRouter,
  createContainer(({ loan, borrowers, property }) => {
    const steps = getSteps({ loan, borrowers, property });
    let nextItem = steps[loan.logic.step - 1].items.find(subStep => !subStep.isDone());

    if (!nextItem) {
      // If all items are done, provide the last item of the step, and let
      // the user click on next step in ProcessPageBar
      nextItem = steps[loan.logic.step - 1].items.pop();
    }

    return {
      steps,
      currentStep: loan.logic.step,
      currentLink: nextItem && nextItem.link,
      currentItemId: nextItem && nextItem.id,
    };
  }),
);
