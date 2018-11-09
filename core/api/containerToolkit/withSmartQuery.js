// @flow
import { withQuery } from 'meteor/cultofcoders:grapher-react';
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

// render the missing doc component only when we want to
const makeRenderMissingDocIfNoData = (render: boolean = false, { single }) => {
  let renderFunc;
  if (typeof render === 'function') {
    renderFunc = props =>
      render(props) && single && (!props.isLoading && !props.data);
  } else {
    renderFunc = ({ isLoading, data }) =>
      render && single && (!isLoading && !data);
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
const withGlobalQueryManager = ({ queryName }, { reactive }) =>
  lifecycle({
    componentDidMount() {
      if (!reactive && window) {
        if (!window.activeQueries) {
          window.activeQueries = [queryName];
        } else {
          window.activeQueries = [...window.activeQueries, queryName];
        }
      }
    },
    componentWillUnmount() {
      if (!reactive && window) {
        window.activeQueries = window.activeQueries.filter(query => query !== queryName);
      }
    },
  });

type withSmartQueryArgs = {
  query: () => mixed,
  params: (props: Object) => Object,
  queryOptions?: { single: boolean },
  dataName?: string,
  renderMissingDoc?: boolean | Function,
  smallLoader?: boolean,
};

const withSmartQuery = ({
  query,
  params = () => {},
  queryOptions = { single: false },
  dataName = 'data',
  // used to bypass the missing doc component
  renderMissingDoc = true,
  smallLoader = false,
}: withSmartQueryArgs) => {
  let completeQuery;

  if (typeof query === 'function') {
    completeQuery = props => query(props).clone(params(props));
  } else {
    completeQuery = props => query.clone(params(props));
  }

  return compose(
    withGlobalQueryManager(query, queryOptions),
    withQuery(completeQuery, { ...queryOptions, loadOnRefetch: false }),
    withLoading(smallLoader),
    makeRenderMissingDocIfNoData(renderMissingDoc, queryOptions),
    makeMapProps(dataName),
    withQueryRefetcher(query),
  );
};
export default withSmartQuery;
