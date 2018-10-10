import Promotions from '../promotions';
import filesReducer from '../../reducers/filesReducer';

Promotions.addReducers({ ...filesReducer });
