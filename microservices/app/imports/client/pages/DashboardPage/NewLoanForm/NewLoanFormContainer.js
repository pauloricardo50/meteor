import { compose, withStateHandlers, withProps } from 'recompose';
import { borrowerUpdate, propertyUpdate } from 'core/api';

export const STEPS = {
  PROPERTY_VALUE: { name: 'propertyValue', optional: false },
  BORROWER_SALARY: { name: 'borrowerSalary', optional: true },
  BORROWER_FORTUNE: { name: 'borrowerFortune', optional: true },
};

export const STEPS_ARRAY = [
  STEPS.PROPERTY_VALUE.name,
  STEPS.BORROWER_SALARY.name,
  STEPS.BORROWER_FORTUNE.name,
];

const shouldOpenDialog = properties =>
  properties.length === 1 && !properties[0].value;

const stateHandlers = withStateHandlers(
  ({ loan: { properties, borrowers } }) => ({
    step: 0,
    numberOfSteps: Object.keys(STEPS).length,
    propertyValue: properties[0].value,
    borrowerSalary: borrowers[0].salary,
    borrowerFortune: borrowers[0].bankFortune,
    open: shouldOpenDialog(properties),
  }),
  {
    handleChange: () => (id, value) => ({ [id]: value }),
    handleNext: ({ step: currentStep }) => event => {
      event.preventDefault();
      return {
        step:
          currentStep === STEPS_ARRAY.length - 1
            ? currentStep
            : currentStep + 1,
      };
    },
    handlePrevious: ({ step: currentStep }) => event => {
      event.preventDefault();
      return {
        step: currentStep === 0 ? currentStep : currentStep - 1,
      };
    },
    handleCloseDialog: () => () => ({ open: false }),
  },
);

const props = withProps(
  ({ handleCloseDialog, loan: { borrowers, properties }, ...props }) => ({
    handleSubmit: event => {
      event.preventDefault();
      return borrowerUpdate
        .run({
          object: {
            salary: props[STEPS.BORROWER_SALARY.name],
            bankFortune: props[STEPS.BORROWER_FORTUNE.name],
          },
          borrowerId: borrowers[0]._id,
        })
        .then(() =>
          propertyUpdate.run({
            object: {
              value: props[STEPS.PROPERTY_VALUE.name],
            },
            propertyId: properties[0]._id,
          }),
        )
        .then(handleCloseDialog);
    },
  }),
);

export default compose(stateHandlers, props);
