import Properties from '../properties';
import filesReducer from '../../reducers/filesReducer';

Properties.addReducers({
  ...filesReducer,
});
