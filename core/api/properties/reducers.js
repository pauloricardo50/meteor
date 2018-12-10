import { addressReducer } from '../reducers';
import Properties from '.';

Properties.addReducers({
  ...addressReducer,
});
