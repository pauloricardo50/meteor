import Organizations from '..';
import filesReducer from '../../reducers/filesReducer';

Organizations.addReducers({
  ...filesReducer,
});
