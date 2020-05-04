import assigneeReducer from '../../reducers/assigneeReducer';
import PromotionLots from '../promotionLots';

PromotionLots.addReducers({ ...assigneeReducer() });
