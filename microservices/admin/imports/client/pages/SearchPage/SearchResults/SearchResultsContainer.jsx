import { withQuery } from 'meteor/cultofcoders:grapher-react';

import query from 'core/api/resolvers/searchDatabase';

export default withQuery(({ searchQuery }) => query.clone({ searchQuery }));
