import { irs10y } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';

exposeQuery({ query: irs10y, options: { allowFilterById: true } });
