import Promotions from '../promotions';
import assigneeReducer from '../../reducers/assigneeReducer';

Promotions.addReducers({ ...assigneeReducer() });
