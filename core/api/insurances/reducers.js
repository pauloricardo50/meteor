import Insurances from '.';
import proNotesReducer from '../reducers/proNotesReducer';

Insurances.addReducers({
  proNotes: proNotesReducer,
});
