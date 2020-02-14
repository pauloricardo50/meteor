import { useTracker } from 'meteor/react-meteor-data';
import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

import { useState, useEffect } from 'react';

import ClientEventService from '../api/events/ClientEventService';
import {
  addQueryToRefetch,
  removeQueryToRefetch,
} from '../api/methods/clientQueryManager';

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

let count = 0;

// Automatically refetch a query on method calls, making everything seem
// reactive
const useQueryRefetcher = ({ query, refetch, refetchOnMethodCall }) => {
  useEffect(() => {
    const uniqueId = count++;
    if (refetchOnMethodCall) {
      // Make sure there are no clashes between multiple queries with the
      // same name
      const queryName = `${query.queryName || query}-hook-${uniqueId}`;
      ClientEventService.addListener(queryName, refetch);
      addQueryToRefetch(queryName, refetchOnMethodCall);
      return () => {
        ClientEventService.removeListener(queryName, refetch);
        removeQueryToRefetch(queryName);
      };
    }
  }, []);
};

export const useStaticMeteorData = (
  { query, params, type = 'many', refetchOnMethodCall = 'all' },
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

  useQueryRefetcher({ refetchOnMethodCall, refetch, query });

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
