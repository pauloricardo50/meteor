import { exposeQuery } from '../../queries/queryHelpers';
import query from './adminPromotions';

exposeQuery(query, {}, { allowFilterById: true });
