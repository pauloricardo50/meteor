import {
  LOAN_QUERIES,
  BORROWER_QUERIES,
  OFFER_QUERIES,
  TASK_QUERIES,
} from '../constants';
import * as queryDefinitions from './queryDefinitions';

const queries = {
  ...LOAN_QUERIES,
  ...BORROWER_QUERIES,
  ...OFFER_QUERIES,
  ...TASK_QUERIES,
  ...queryDefinitions,
};
export { queries };
export { withQuery } from 'meteor:cultofcoders:grapher-react';
