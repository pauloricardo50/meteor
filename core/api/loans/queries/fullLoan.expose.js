import { exposeQuery } from '../../queries/queryHelpers';
import query from './fullLoan';

exposeQuery(query, {}, { allowFilterById: true });
