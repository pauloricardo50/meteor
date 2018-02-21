const createResolver = (queryOptions, firewall, functionBody) => {
  // FIXME: Somehow get the query here from the queryOptions

  query.expose({
    firewall,
  });

  query.resolve(functionBody);
};

export default createResolver;
