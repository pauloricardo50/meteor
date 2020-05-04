import { STEPS } from '../api/loans/loanConstants';
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
    const foundStructure = structures.find(
      ({ id }) => id === selectedStructure,
    );

    if (foundStructure) {
      structure = foundStructure;

      if (structure.propertyId) {
        const property = properties.find(
          ({ _id }) => _id === structure.propertyId,
        );
        structure = { ...structure, property };
      }

      if (structure.promotionOptionId) {
        const promotionOption = promotionOptions.find(
          ({ _id }) => _id === structure.promotionOptionId,
        );
        structure = {
          ...structure,
          property: Calculator.formatPromotionOptionIntoProperty(
            promotionOption,
          ),
        };
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
          borrowerMortgageNotes.find(({ _id }) => _id === id),
        );

        structure = { ...structure, mortgageNotes };
      }
    } else {
      structure = {};
    }

    return structure;
  }

  return structure;
};

export const formatLoanWithDocuments = loan => {
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

export const shouldSendStepNotification = (prevStep, nextStep) =>
  (prevStep === STEPS.SOLVENCY || prevStep === STEPS.REQUEST) &&
  nextStep === STEPS.OFFERS;
