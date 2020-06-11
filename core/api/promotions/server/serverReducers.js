import assigneeReducer from '../../reducers/assigneeReducer';
import Promotions from '../promotions';

Promotions.addReducers({ ...assigneeReducer() });
