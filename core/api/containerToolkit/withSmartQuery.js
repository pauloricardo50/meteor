import { withQuery } from 'meteor/cultofcoders:grapher-react';
import { mapProps, compose, branch, renderComponent } from 'recompose';
import Loading from '../../components/Loading';

const withSmartQuery = ({ query, queryOptions, dataName = 'data' }) =>
  compose(
    withQuery(query, queryOptions),
    branch(({ isLoading }) => isLoading, renderComponent(Loading)),
    mapProps(({ data, ...rest }) => ({ [dataName]: data, ...rest })),
  );

export default withSmartQuery;
