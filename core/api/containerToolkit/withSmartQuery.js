// @flow
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import { mapProps, compose, branch, renderComponent } from 'recompose';
import Loading from '../../components/Loading';
import MissingDoc from '../../components/MissingDoc';

const renderSpinnerWhileLoading = branch(
  ({ isLoading }) => isLoading,
  renderComponent(Loading),
);

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

type withSmartQueryArgs = {
  query: (params: Object) => mixed,
  queryOptions?: { single: boolean },
  dataName?: string,
  renderMissingDoc?: boolean,
};

const withSmartQuery = ({
  query,
  queryOptions = { single: false },
  dataName = 'data',
  // used to bypass the missing doc component
  renderMissingDoc = true,
}: withSmartQueryArgs) =>
  compose(
    withQuery(query, queryOptions),
    renderSpinnerWhileLoading,
    makeRenderMissingDocIfNoData(renderMissingDoc && queryOptions.single),
    makeMapProps(dataName),
  );

export default withSmartQuery;
