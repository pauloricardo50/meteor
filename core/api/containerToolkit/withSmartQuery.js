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
import ClientEventService, {
  CALLED_METHOD,
} from '../events/ClientEventService';

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
  mapProps(({ data, isLoading, error, ...rest }) =>
    // Theodor
    // FIXME: This creates tons of bugs with queries not running in the
    // right order: https://github.com/cult-of-coders/grapher-react/issues/24
    // if (error) {
    //   throw error;
    // }
    ({ [dataName]: data, ...rest }));

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
  updateWithMethods,
}: withSmartQueryArgs) => {
  const shoundRenderMissingDoc = renderMissingDoc && queryOptions.single;
  const shouldUpdateWithMethod = !queryOptions.reactive && updateWithMethods;

  let completeQuery;

  if (typeof query === 'function') {
    completeQuery = props => query(props).clone(params(props));
  } else {
    completeQuery = props => query.clone(params(props));
  }

  return compose(
    withState('hasLoadedOnce', 'setHasLoadedOnce', false),
    withQuery(completeQuery, queryOptions),
    withLoading(smallLoader, shouldUpdateWithMethod && 'hasLoadedOnce'),
    makeRenderMissingDocIfNoData(shoundRenderMissingDoc),
    makeMapProps(dataName),
    updateWithMethods
      ? lifecycle({
        componentDidMount() {
          if (shouldUpdateWithMethod) {
            // For every method that is called on the client, refetch this query
            ClientEventService.addListener(CALLED_METHOD, () => {
              // Disable loading for subsequent refetch calls
              this.props.setHasLoadedOnce(true);
              this.props.refetch();
            });
          }
        },
        componentWillUnmount() {
          if (shouldUpdateWithMethod) {
            ClientEventService.removeListener(CALLED_METHOD, () => {
              this.props.setHasLoadedOnce(true);
              this.props.refetch();
            });
          }
        },
      })
      : x => x,
  );
};
export default withSmartQuery;
