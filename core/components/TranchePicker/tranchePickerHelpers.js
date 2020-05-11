export const checkTranches = (tranches, wantedLoan) => {
  const sum = tranches.reduce((total, { value }) => total + value, 0);
  const sumIsEqualToWantedLoan = sum === wantedLoan;
  const allTypesAreDefined = tranches.every(({ type }) => !!type);

  if (!sumIsEqualToWantedLoan) {
    return {
      status: 'error',
      error: 'sumIsNotEqualToWantedLoan',
      additionalData: { sum },
    };
  }

  if (!allTypesAreDefined) {
    return {
      status: 'error',
      error: 'allTypesAreNotDefined',
      additionalData: { sum },
    };
  }

  return { status: 'ok', additionalData: { sum } };
};
