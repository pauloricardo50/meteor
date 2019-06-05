import { exposeQuery } from '../../queries/queryHelpers';
import query from './adminProperties';

exposeQuery(query, {}, { allowFilterById: true });
