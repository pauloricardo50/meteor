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
        new Promise((resolve, reject) =>
          query.clone(params(model)).fetch((error, data) => {
            if (error) {
              reject(error);
            }

            const ids = data.map(({ _id }) => _id);

            resolve(allowNull ? [null, ...ids] : ids);
          }))
      : customAllowedValues,
    transform: queryTransform || uniformsTransform || (x => x),
  };
});
