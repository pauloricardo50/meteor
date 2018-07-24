export const precisionMiddleware = () => next => (...args) => {
  const result = next(...args);

  if (typeof result === 'number') {
    return Number(result.toPrecision(10));
  }

  return result;
};
