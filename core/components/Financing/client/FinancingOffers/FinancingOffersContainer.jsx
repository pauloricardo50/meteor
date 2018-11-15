import React from 'react';
import { compose, withStateHandlers } from 'recompose';

export const { Provider, Consumer } = React.createContext();

const withContext = Component => ({ sortBy, setSort, setOrder, ...props }) => (
  <Provider value={{ sortBy, setSort, setOrder }}>
    <Component {...props} />
  </Provider>
);

export default compose(
  withStateHandlers(
    { sortBy: 'maxAmount' },
    {
      setSort: () => sortBy => ({ sortBy }),
      setOrder: () => () => ({}),
    },
  ),
  withContext,
);
