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
