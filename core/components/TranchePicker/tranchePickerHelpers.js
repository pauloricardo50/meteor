export const checkTranches = (tranches, wantedLoan) => {
  const sum = tranches.reduce((total, { value }) => total + value, 0);
  const sumIsEqualToWantedLoan = sum === wantedLoan;
  const allTypesAreDefined = tranches.every(({ type }) => !!type);

  const errors = [
    !sumIsEqualToWantedLoan && 'sumIsNotEqualToWantedLoan',
    !allTypesAreDefined && 'allTypesAreNotDefined',
  ].filter(x => x);

  return {
    status: errors.length ? 'error' : 'ok',
    errors,
    additionalData: { sum },
  };
};
