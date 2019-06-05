import { irs10y } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';

exposeQuery(irs10y, {}, { allowFilterById: true });
