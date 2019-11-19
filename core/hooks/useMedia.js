import * as React from 'react';

const { useState, useEffect } = React;

const camelToHyphen = str =>
  str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`).toLowerCase();

const objectToString = query => {
  if (typeof query === 'string') return query;
  return Object.entries(query)
    .map(([feature, value]) => {
      feature = camelToHyphen(feature);
      if (typeof value === 'boolean') {
        return value ? feature : `not ${feature}`;
      }
      if (typeof value === 'number' && /[height|width]$/.test(feature)) {
        value = `${value}px`;
      }
      return `(${feature}: ${value})`;
    })
    .join(' and ');
};

export const useMedia = (rawQuery, defaultState = false) => {
  const [state, setState] = useState(defaultState);
  const query = objectToString(rawQuery);
  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (!mounted) return;
      setState(!!mql.matches);
    };

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query]);

  return state;
};

export default useMedia;
