import { useTracker } from 'meteor/react-meteor-data';
import { useState, useEffect } from 'react';
import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

const getStaticFunction = type =>
  ({
    single: 'fetchOne',
    many: 'fetch',
    count: 'getCount',
  }[type]);

const getSubscriptionFunction = type =>
  type === 'count' ? 'subscribeCount' : 'subscribe';

export const useStaticMeteorData = (
  { query, params, type = 'many' },
  deps = [],
) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  let finalQuery;

  if (typeof query === 'string') {
    finalQuery = createQuery({ [query]: params });
  } else {
    finalQuery = query.clone(params);
  }

  const refetch = () => {
    setLoading(true);

    finalQuery[getStaticFunction(type)]((err, res) => {
      if (err) {
        setError(err);
        setData(null);
      } else {
        setError(null);
        setData(res);
      }
      setLoading(false);
    });
  };

  useEffect(refetch, deps);

  return { loading, data, error, refetch };
};

export const useReactiveMeteorData = (
  { query, params, type = 'many' },
  deps = [],
) => {
  let finalQuery;

  if (typeof query === 'string') {
    finalQuery = createQuery({ [query]: params });
  } else {
    finalQuery = query.clone(params);
  }

  const { loading, subscribedQuery } = useTracker(() => {
    const handle = finalQuery[getSubscriptionFunction(type)]();
    const isReady = handle.ready();
    return { loading: !isReady, subscribedQuery: finalQuery };
  }, deps);

  const data = useTracker(
    () => subscribedQuery[getStaticFunction(type)](),
    deps,
  );

  return { loading, data };
};
