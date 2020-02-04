//      
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

import {
  mapProps,
  compose,
  branch,
  renderComponent,
  lifecycle,
} from 'recompose';
import { withLoading } from '../../components/Loading';
import MissingDoc from '../../components/MissingDoc';
import ClientEventService from '../events/ClientEventService';
import {
  addQueryToRefetch,
  removeQueryToRefetch,
} from '../methods/clientQueryManager';
import makeSkipContainer from './skipContainer';

// render the missing doc component only when we want to
const makeRenderMissingDocIfNoData = (render          = false, { single }) => {
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
  mapProps(({ data, isLoading, error, ...rest }) => ({
    [dataName]: data,
    ...rest,
  }));

const withQueryRefetcher = ({ queryName }) =>
  lifecycle({
    componentDidMount() {
      const { refetch } = this.props;

      if (refetch) {
        ClientEventService.addListener(queryName, refetch);
      }
    },
    componentWillUnmount() {
      const { refetch } = this.props;
      if (refetch) {
        ClientEventService.removeListener(queryName, refetch);
      }
    },
  });

// This adds all non-reactive queries on the window object, and removes them
// when the query disappears
// These queries can then all be refreshed from `clientMethodsConfig`
// every time a method is called
const withGlobalQueryManager = (
  { queryName },
  { reactive },
  refetchOnMethodCall,
) => {
  const shouldActivateGlobalRefetch =
    refetchOnMethodCall && !reactive && global.window;

  if (!shouldActivateGlobalRefetch) {
    return x => x;
  }

  return lifecycle({
    componentDidMount() {
      addQueryToRefetch(queryName, refetchOnMethodCall);
    },
    componentWillUnmount() {
      removeQueryToRefetch(queryName);
    },
  });
};

                           
                     
                                    
                                     
                    
                                        
                        
  

const calculateParams = (params, props) => {
  if (typeof params === 'function') {
    return params(props);
  }
  return params;
};

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
}                    ) => {
  let completeQuery;

  if (typeof query === 'function') {
    completeQuery = props => query(props).clone(calculateParams(params, props));
  } else if (typeof query === 'string') {
    completeQuery = props =>
      createQuery({ [query]: calculateParams(params, props) });
  } else {
    completeQuery = props => query.clone(calculateParams(params, props));
  }

  const container = compose(
    withGlobalQueryManager(query, queryOptions, refetchOnMethodCall),
    withQuery(completeQuery, { loadOnRefetch: false, ...queryOptions }),
    withLoading(smallLoader),
    makeRenderMissingDocIfNoData(renderMissingDoc, queryOptions),
    makeMapProps(dataName),
    withQueryRefetcher(query),
  );

  if (skip) {
    return makeSkipContainer(container, skip);
  }

  return container;
};

export default withSmartQuery;
