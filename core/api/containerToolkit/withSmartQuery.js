// @flow
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import {
  mapProps,
  compose,
  branch,
  renderComponent,
  lifecycle,
  withState,
} from 'recompose';
import { withLoading } from '../../components/Loading';
import MissingDoc from '../../components/MissingDoc';
import ClientEventService from '../events/ClientEventService';

// render the missing doc component only when we want to
const makeRenderMissingDocIfNoData = (render: boolean = false) =>
  branch(
    ({ isLoading, data }) => render && (!isLoading && !data),
    renderComponent(MissingDoc),
  );

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
      const { refetch, setInitialLoaded } = this.props;

      // Only display the loader once, afterwards, when the query is refetched,
      // Don't show the loader anymore
      setInitialLoaded(true);
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

type withSmartQueryArgs = {
  query: () => mixed,
  params: (props: Object) => Object,
  queryOptions?: { single: boolean },
  dataName?: string,
  renderMissingDoc?: boolean,
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
  const shoundRenderMissingDoc = renderMissingDoc && queryOptions.single;

  let completeQuery;

  if (typeof query === 'function') {
    completeQuery = props => query(props).clone(params(props));
  } else {
    completeQuery = props => query.clone(params(props));
  }

  return compose(
    withState('initialLoaded', 'setInitialLoaded', false),
    withQuery(completeQuery, queryOptions),
    withLoading(smallLoader, 'initialLoaded'),
    makeRenderMissingDocIfNoData(shoundRenderMissingDoc),
    makeMapProps(dataName),
    withQueryRefetcher(query),
  );
};
export default withSmartQuery;
