import { withQuery } from 'meteor/cultofcoders:grapher-react';
import { mapProps, compose, branch, renderComponent } from 'recompose';
import Loading from '../../components/Loading';
import MissingDoc from '../../components/MissingDoc';

const renderSpinnerWhileLoading = branch(
  ({ isLoading }) => isLoading,
  renderComponent(Loading),
);

// render the missing doc component only when we want to
const makeRenderMissingDocIfNoData = (render = false) =>
  branch(
    ({ isLoading, data }) => render && (!isLoading && !data),
    renderComponent(MissingDoc),
  );

const withSmartQuery = ({
  query,
  queryOptions = {},
  dataName = 'data',
  // used to bypass the missing doc component
  renderMissingDoc = true,
}) =>
  compose(
    withQuery(query, queryOptions),
    renderSpinnerWhileLoading,
    makeRenderMissingDocIfNoData(renderMissingDoc && queryOptions.single),
    mapProps(({ data, ...rest }) => ({ [dataName]: data, ...rest })),
  );
export default withSmartQuery;
