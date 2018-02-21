const callResolver = (queryOptions, params) =>
  new Promise((resolve, reject) => {
    // FIXME: Somehow get the query here from the queryOptions

    query.clone(params).fetch((err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });

export default callResolver;
