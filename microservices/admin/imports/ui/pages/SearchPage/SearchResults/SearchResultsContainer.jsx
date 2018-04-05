import query from 'core/api/resolvers/searchDatabase';
import { withQuery } from 'core/api';

export default withQuery(({ searchQuery }) => query.clone({ searchQuery }));
