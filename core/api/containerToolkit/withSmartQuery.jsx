import {
  branch,
  compose,
  mapProps,
  renderComponent,
  withProps,
} from 'recompose';

import { withLoading } from '../../components/Loading';
import MissingDoc from '../../components/MissingDoc';
import useMeteorData from '../../hooks/useMeteorData';
import makeSkipContainer from './skipContainer';

// render the missing doc component only when we want to
const makeRenderMissingDocIfNoData = (render = false, { single }) => {
  let renderFunc;
  if (typeof render === 'function') {
    renderFunc = props =>
      render(props) && single && !props.isLoading && !props.data;
  } else {
    renderFunc = ({ isLoading, data }) =>
      render && single && !isLoading && !data;
  }

  return branch(renderFunc, renderComponent(MissingDoc));
};

// Use proper name for data, and remove unnecessary props from children
// error should be thrown and catched by our errorboundaries anyways
// or displayed by an alert
const makeMapProps = dataName =>
  mapProps(({ data, isLoading, error, uniqueQueryName, ...rest }) => ({
    [dataName]: data,
    ...rest,
  }));

const getFinalValue = (func, props) =>
  typeof func === 'function' ? func(props) : func;

const withSmartQuery = ({
  query,
  params = {},
  queryOptions = { single: false },
  dataName = 'data',
  // used to bypass the missing doc component
  renderMissingDoc = true,
  smallLoader = false,
  refetchOnMethodCall = 'all',
  skip,
  deps,
  loadOnRefetch,
}) => {
  const container = compose(
    withProps(props => {
      const finalQuery = getFinalValue(query, props);
      const finalParams = getFinalValue(params, props);
      const finalDeps = getFinalValue(deps, props);

      const { data, loading } = useMeteorData(
        {
          query: finalQuery,
          params: finalParams,
          type: queryOptions.single ? 'single' : 'many',
          reactive: queryOptions.reactive,
          refetchOnMethodCall,
        },
        finalDeps,
      );

      return {
        data,
        loading: loadOnRefetch ? loading : data ? false : loading,
      };
    }),
    withLoading(smallLoader),
    makeRenderMissingDocIfNoData(renderMissingDoc, queryOptions),
    makeMapProps(dataName),
  );

  if (skip) {
    return makeSkipContainer(container, skip);
  }

  return container;
};

export default withSmartQuery;
