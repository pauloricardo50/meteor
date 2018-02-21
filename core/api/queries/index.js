import {
  LOAN_QUERIES,
  BORROWER_QUERIES,
  OFFER_QUERIES,
  TASK_QUERIES,
} from '../constants';
import * as resolverQueriesDefinitions from './resolverQueriesDefinitions';

const queries = {
  ...LOAN_QUERIES,
  ...BORROWER_QUERIES,
  ...OFFER_QUERIES,
  ...TASK_QUERIES,
  ...resolverQueriesDefinitions,
};
export { queries };
export { withQuery } from 'meteor:cultofcoders:grapher-react';
