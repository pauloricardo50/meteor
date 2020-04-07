import { createQuery } from 'meteor/cultofcoders:grapher';

import { RESOLVERS } from './resolversConstants';

export const searchDatabase = createQuery(RESOLVERS.SEARCH_DATABASE, () => {});
