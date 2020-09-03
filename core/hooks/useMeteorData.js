import { useTracker } from 'meteor/react-meteor-data';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ClientEventService from '../api/events/ClientEventService';
import {
  addQueryToRefetch,
  removeQueryToRefetch,
} from '../api/methods/clientQueryManager';
import { createQuery } from '../api/queries';
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
  // Make sure there are no clashes between multiple queries with the
  // same name
  const qString = query?.queryName || query;
  const queryName = useMemo(() => `${qString}-hook-${count++}`, [qString]);

  useEffect(() => {
    // Don't unnecessarily refetch if the query is falsy, like when it's conditional
    if (qString && refetchOnMethodCall) {
      // Remove any existing listeners when this useEffect is ran again
      ClientEventService.removeAllListeners(queryName);
      removeQueryToRefetch(queryName);

      ClientEventService.addListener(queryName, refetch);
      addQueryToRefetch(queryName, refetchOnMethodCall);

      return () => {
        ClientEventService.removeAllListeners(queryName);
        removeQueryToRefetch(queryName);
      };
    }
  }, [queryName, refetch, refetchOnMethodCall]);
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
    config,
  } = useAsyncStateMachine();
  const fetchIdRef = useRef(0);

  const refetch = useCallback(
    (
      { query: refetchQuery = query, params: refetchParams = params } = {},
      callback,
    ) => {
      const finalQuery = getQuery(refetchQuery, refetchParams);

      if (!finalQuery) {
        setData(undefined, undefined);
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
          setError(err, { query: refetchQuery, params: refetchParams });
        } else {
          setData(res, { query: refetchQuery, params: refetchParams });
          if (callback) {
            callback(res);
          }
        }
      });
    },
    [query, params],
  );

  useEffect(refetch, deps);

  useQueryRefetcher({
    refetchOnMethodCall,
    refetch: () => refetch(config),
    query: config?.query || query,
    params,
  });

  return {
    loading: isLoading,
    data,
    error,
    refetch,
    isInitialLoad: isLoading && data === undefined,
  };
};

export const useReactiveMeteorData = (
  { query, params, type = 'many' },
  deps = [],
) => {
  const [error, setError] = useState(undefined);
  const finalQuery = getQuery(query, params);

  const { loading, subscribedQuery } = useTracker(() => {
    if (!finalQuery) {
      return { loading: false };
    }

    const handle = finalQuery[getSubscriptionFunction(type)]({
      onStop(err) {
        if (err) {
          setError(err);
        }
      },
      onReady() {
        setError(undefined);
      },
    });
    const isReady = handle.ready();

    return { loading: !isReady, subscribedQuery: finalQuery };
  }, deps);

  const data = useTracker(() => {
    if (subscribedQuery) {
      return subscribedQuery[getStaticFunction(type)]();
    }

    return null;
  }, deps);

  return { loading: loading && !error, data, error };
};

const useMeteorData = (args, deps) => {
  if (args.reactive) {
    return useReactiveMeteorData(args, deps);
  }

  return useStaticMeteorData(args, deps);
};

export default useMeteorData;
