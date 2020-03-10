import InsuranceRequests from '.';
import mainAssigneeReducer from '../reducers/mainAssigneeReducer';
import proNotesReducer from '../reducers/proNotesReducer';

InsuranceRequests.addReducers({
  mainAssignee: mainAssigneeReducer,
  proNotes: proNotesReducer,
});
