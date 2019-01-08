import { withProps } from 'recompose';

export default withProps(({
  transform: uniformsTransform,
  customAllowedValues,
  customAllowedValuesFromQuery,
}) => {
  const {
    query,
    params = () => ({}),
    allowNull = false,
    transform: queryTransform,
  } = customAllowedValuesFromQuery || {};

  return {
    customAllowedValues: customAllowedValuesFromQuery
      ? model =>
        query.clone(params(model)).fetch((error, data) => {
          if (error) {
            throw error;
          }

          return allowNull ? [null, ...data] : data;
        })
      : customAllowedValues,
    transform: queryTransform || uniformsTransform || (x => x),
  };
});
