import { compose, withStateHandlers, withProps } from 'recompose';
import { loanUpdate, borrowerUpdate, propertyUpdate } from 'core/api';

export const STEPS = {
  LOAN_NAME: 'loanName',
  PROPERTY_VALUE: 'propertyValue',
  BORROWER_SALARY: 'borrowerSalary',
  BORROWER_FORTUNE: 'borrowerFortune',
};

export const STEPS_ARRAY = [
  STEPS.LOAN_NAME,
  STEPS.PROPERTY_VALUE,
  STEPS.BORROWER_SALARY,
  STEPS.BORROWER_FORTUNE,
];

const shouldOpenDialog = ({ name, properties, borrowers }) => {
  const hasNoPropertyValue = properties.length === 1 && !properties[0].value;
  return (
    hasNoPropertyValue ||
    !name ||
    !borrowers[0].salary ||
    !borrowers[0].bankFortune
  );
};

export default compose(
  withStateHandlers(
    ({ loan: { name, properties, borrowers } }) => ({
      step: 0,
      numberOfSteps: Object.keys(STEPS).length,
      loanName: name,
      propertyValue: properties[0].value,
      borrowerSalary: borrowers[0].salary,
      borrowerFortune: borrowers[0].bankFortune,
      open: shouldOpenDialog({ name, properties, borrowers }),
    }),
    {
      handleChange: () => (id, value) => ({
        [id]: value,
      }),
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
  ),
  withProps(
    ({
      handleCloseDialog,
      loan: { _id: loanId, borrowerIds, properties },
      ...props
    }) => ({
      handleSubmit: event => {
        event.preventDefault();
        return loanUpdate
          .run({ object: { name: props[STEPS.LOAN_NAME] }, loanId })
          .then(
            borrowerUpdate.run({
              object: {
                salary: props[STEPS.BORROWER_SALARY],
                bankFortune: props[STEPS.BORROWER_FORTUNE],
              },
              borrowerId: borrowerIds[0],
            }),
          )
          .then(
            propertyUpdate.run({
              object: { value: props[STEPS.PROPERTY_VALUE] },
              propertyId: properties[0]._id,
            }),
          )
          .then(handleCloseDialog)
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
    }),
  ),
);
