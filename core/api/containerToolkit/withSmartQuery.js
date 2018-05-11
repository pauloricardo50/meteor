import { withQuery } from 'meteor/cultofcoders:grapher-react';
import { mapProps, compose, branch, renderComponent } from 'recompose';
import Loading from '../../components/Loading';
import MissingDoc from '../../components/MissingDoc';

const renderSpinnerWhileLoading = branch(
  ({ isLoading }) => isLoading,
  renderComponent(Loading),
);

// render the missing doc component only when we want to
const renderMissingDocIfNoData = (render = false, dataName) =>
  branch(({ isLoading, data }) => {
    console.log('>>>>>>', dataName, isLoading, data);
    return render && (!isLoading && !data);
  }, renderComponent(MissingDoc));

const withSmartQuery = ({ query, queryOptions = {}, dataName = 'data' }) => {
  console.log('dataName=', dataName);
  return compose(
    withQuery(query, queryOptions),
    renderSpinnerWhileLoading,
    renderMissingDocIfNoData(queryOptions.single, dataName),
    mapProps(({ data, ...rest }) => ({ [dataName]: data, ...rest })),
  );
};

export default withSmartQuery;
