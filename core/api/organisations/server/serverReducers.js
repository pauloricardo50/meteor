import Organisations from '..';
import filesReducer from '../../reducers/filesReducer';

Organisations.addReducers({
  ...filesReducer,
});
