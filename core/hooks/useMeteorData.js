import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';
import { useTracker } from 'meteor/react-meteor-data';

import { useCallback, useEffect, useRef } from 'react';

import ClientEventService from '../api/events/ClientEventService';
import {
  addQueryToRefetch,
  removeQueryToRefetch,
} from '../api/methods/clientQueryManager';
import useAsyncStateMachine from './useAsyncStateMachine';

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
      const queryName = `${(query && query.queryName) ||
        query}-hook-${uniqueId}`;
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
  const {
    data,
    error,
    isLoading,
    setData,
    setError,
    setLoading,
  } = useAsyncStateMachine();
  const fetchIdRef = useRef(0);

  const refetch = useCallback(
    (
      { query: refetchQuery = query, params: refetchParams = params } = {},
      callback,
    ) => {
      const finalQuery = getQuery(refetchQuery, refetchParams);

      if (!finalQuery) {
        setData(null);
        return;
      }

      if (!isLoading) {
        // isLoading is already set initially
        setLoading();
      }

      // Give this fetch an id, to make sure we only keep track of the last
      // refetch if they're called multiple times in a row
      // ideally this refetch would also be debounced
      const fetchId = ++fetchIdRef.current;
      finalQuery[getStaticFunction(type)]((err, res) => {
        if (fetchId !== fetchIdRef.current) {
          // If we're getting data back from a refetch that isn't the latest,
          // don't run this
          return;
        }

        if (err) {
          setError(err);
        } else {
          setData(res);
          if (callback) {
            callback(res);
          }
        }
      });
    },
    [query, params],
  );

  useEffect(refetch, deps);

  useQueryRefetcher({ refetchOnMethodCall, refetch, query });

  return { loading: isLoading, data, error, refetch };
};

export const useReactiveMeteorData = (
  { query, params, type = 'many' },
  deps = [],
) => {
  const finalQuery = getQuery(query, params);

  const { loading, subscribedQuery } = useTracker(() => {
    if (!finalQuery) {
      return { loading: false };
    }

    const handle = finalQuery[getSubscriptionFunction(type)]();
    const isReady = handle.ready();
    return { loading: !isReady, subscribedQuery: finalQuery };
  }, deps);

  const data = useTracker(
    () => (subscribedQuery ? subscribedQuery[getStaticFunction(type)]() : null),
    deps,
  );

  return { loading, data };
};
