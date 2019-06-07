import { exposeQuery } from '../../queries/queryHelpers';
import { irs10y } from '../queries';

exposeQuery({ query: irs10y, options: { allowFilterById: true } });
