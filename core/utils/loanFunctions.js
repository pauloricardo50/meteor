import Calculator from './Calculator';

export const loanIsVerified = ({
  loan: {
    logic: {
      verification: { validated },
    },
  },
}) => validated !== undefined;

export const formatLoanWithStructure = ({
  selectedStructure,
  structures,
  properties,
  offers,
  promotionOptions,
  borrowers,
}) => {
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
    return undefined;
  }

  const { structure, properties = [] } = loan;
  const { property, propertyId } = structure;
  const structureProperty = properties.find(({ _id }) => _id === propertyId);
  const propertyDocuments = structureProperty && structureProperty.documents;

  return {
    ...loan,
    structure: {
      ...structure,
      property: {
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
