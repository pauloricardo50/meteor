import Promotions from '../promotions';
import filesReducer from '../../reducers/filesReducer';
import assigneeReducer from '../../reducers/assigneeReducer';

Promotions.addReducers({ ...filesReducer, ...assigneeReducer() });
