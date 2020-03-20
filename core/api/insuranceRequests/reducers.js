import InsuranceRequests from '.';
import mainAssigneeReducer from '../reducers/mainAssigneeReducer';
import proNotesReducer from '../reducers/proNotesReducer';

InsuranceRequests.addReducers({
  mainAssignee: mainAssigneeReducer,
  mainAssigneeLink: {
    body: { assigneeLinks: 1 },
    reduce: ({ assigneeLinks = [] }) =>
      assigneeLinks.find(({ isMain }) => isMain),
  },
  proNotes: proNotesReducer,
});
