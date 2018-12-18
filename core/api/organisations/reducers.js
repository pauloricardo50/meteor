import addressReducer from '../reducers/addressReducer';
import Organisations from './organisations';

Organisations.addReducers({
  ...addressReducer,
});
