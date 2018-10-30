import PromotionLots from '../promotionLots';
import filesReducer from '../../reducers/filesReducer';
import assigneeReducer from '../../reducers/assigneeReducer';

PromotionLots.addReducers({ ...filesReducer, ...assigneeReducer() });
