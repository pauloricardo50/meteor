import Properties from '../properties';
import filesReducer from '../../reducers/filesReducer';
import assigneeReducer from '../../reducers/assigneeReducer';

Properties.addReducers({
  ...filesReducer,
  ...assigneeReducer(),
});
