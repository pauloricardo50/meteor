// @flow
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import { mapProps, compose, branch, renderComponent } from 'recompose';
import { withLoading } from '../../components/Loading';
import MissingDoc from '../../components/MissingDoc';

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
  query: (params: Object) => mixed,
  queryOptions?: { single: boolean },
  dataName?: string,
  renderMissingDoc?: boolean,
  smallLoader?: boolean,
};

const withSmartQuery = ({
  query,
  queryOptions = { single: false },
  dataName = 'data',
  // used to bypass the missing doc component
  renderMissingDoc = true,
  smallLoader = false,
}: withSmartQueryArgs) =>
  compose(
    withQuery(query, queryOptions),
    withLoading(smallLoader),
    makeRenderMissingDocIfNoData(renderMissingDoc && queryOptions.single),
    makeMapProps(dataName),
  );

export default withSmartQuery;
