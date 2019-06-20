import {
  STEPS,
  LOAN_STATUS_ORDER,
  LOAN_STATUS,
  TASK_STATUS,
} from '../api/constants';
import Calculator from './Calculator';

export const formatLoanWithStructure = ({
  selectedStructure,
  structures = [],
  properties,
  offers,
  promotionOptions,
  borrowers = [],
}) => {
  if (structures.length === 0) {
    return undefined;
  }

  let structure = {};

  if (selectedStructure) {
    const foundStructure = structures.find(({ id }) => id === selectedStructure);

    if (foundStructure) {
      structure = foundStructure;

      if (structure.propertyId) {
        const property = properties.find(({ _id }) => _id === structure.propertyId);
        structure = { ...structure, property };
      }

      if (structure.promotionOptionId) {
        const property = promotionOptions.find(({ _id }) => _id === structure.promotionOptionId);
        structure = { ...structure, property };
      }

      if (structure.offerId) {
        const offer = offers.find(({ _id }) => _id === structure.offerId);
        structure = { ...structure, offer };
      }

      if (structure.mortgageNoteIds) {
        const borrowerMortgageNotes = borrowers.reduce(
          (arr, { mortgageNotes: notes = [] }) => [...arr, ...notes],
          [],
        );
        const mortgageNotes = structure.mortgageNoteIds.map(id =>
          borrowerMortgageNotes.find(({ _id }) => _id === id));

        structure = { ...structure, mortgageNotes };
      }
    } else {
      structure = {};
    }

    return structure;
  }

  return structure;
};

export const formatLoanWithDocuments = (loan) => {
  if (!loan || !loan.structure) {
    return loan;
  }

  const { structure, properties = [] } = loan;
  const { property, propertyId } = structure;
  const structureProperty = properties.find(({ _id }) => _id === propertyId);
  const propertyDocuments = structureProperty && structureProperty.documents;

  return {
    ...loan,
    structure: {
      ...structure,
      property: property && {
        ...property,
        documents: propertyDocuments,
      },
    },
  };
};

export const formatLoanWithPromotion = (loan) => {
  if (loan.structure.promotionOptionId) {
    const property = Calculator.selectProperty({
      loan,
      // Do this to make sure we're getting the promotionOption and not the
      // fake property created from it
      structureId: loan.structure.id,
    });
    return { ...loan, structure: { ...loan.structure, property } };
  }

  return loan;
};

export const shouldSendStepNotification = (prevStep, nextStep) =>
  (prevStep === STEPS.SOLVENCY || prevStep === STEPS.REQUEST)
  && nextStep === STEPS.OFFERS;

export const nextDueTaskReducer = ({ tasksCache: tasks = [] }) => {
  const activeTasks = tasks.filter(({ status: taskStatus }) => taskStatus === TASK_STATUS.ACTIVE);
  const tasksWithoutDate = activeTasks
    .filter(({ dueAt }) => !dueAt)
    .sort(({ createdAt: A }, { createdAt: B }) => A - B);

  if (tasksWithoutDate.length > 0) {
    const task = tasksWithoutDate[0];
    return { ...task, dueAt: task.createdAt, noDueDate: true };
  }

  const sortedTasks = activeTasks.sort(({ dueAt: A }, { dueAt: B }) => A - B);

  if (sortedTasks.length > 0) {
    return sortedTasks[0];
  }
};
