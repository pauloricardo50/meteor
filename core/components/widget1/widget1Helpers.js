export const hideFinmaValues = (borrowRatio, incomeRatio) =>
  !(borrowRatio && incomeRatio)
  || Math.abs(borrowRatio) === Infinity
  || Math.abs(incomeRatio) === Infinity;
