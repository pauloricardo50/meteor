import { useTracker } from 'meteor/react-meteor-data';
import { useState, useEffect } from 'react';
import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

const getQuery = (query, params) => {
  if (!query) {
    return;
  }

  if (typeof query === 'string') {
    return createQuery({ [query]: params });
  }
  return query.clone(params);
};

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

  const finalQuery = getQuery(query, params);

  const refetch = () => {
    if (!finalQuery) {
      setLoading(false);
      setData(null);
      return;
    }

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
  const finalQuery = getQuery(query, params);

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
