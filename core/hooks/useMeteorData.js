import { useTracker } from 'meteor/react-meteor-data';
import { useState, useEffect } from 'react';

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

  const refetch = () => {
    setLoading(true);
    query.clone(params)[getStaticFunction(type)]((err, res) => {
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
  const clonedQuery = query.clone(params);

  const { loading, subscribedQuery } = useTracker(() => {
    const handle = clonedQuery[getSubscriptionFunction(type)]();
    const isReady = handle.ready();
    return { loading: !isReady, subscribedQuery: clonedQuery };
  }, deps);

  const data = useTracker(
    () => subscribedQuery[getStaticFunction(type)](),
    deps,
  );

  return { loading, data };
};
