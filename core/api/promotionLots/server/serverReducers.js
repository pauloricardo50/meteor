import PromotionLots from '../promotionLots';
import assigneeReducer from '../../reducers/assigneeReducer';

PromotionLots.addReducers({ ...assigneeReducer() });
