import query from 'core/api/resolvers/searchDatabase';
import { withQuery } from 'core/api';

export default withQuery(props =>
  query.clone({ searchQuery: props.searchQuery }));
