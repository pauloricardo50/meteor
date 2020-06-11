import mainAssigneeReducer from '../reducers/mainAssigneeReducer';
import nextDueTaskReducer from '../reducers/nextDueTaskReducer';
import proNotesReducer from '../reducers/proNotesReducer';
import InsuranceRequests from '.';

InsuranceRequests.addReducers({
  mainAssignee: mainAssigneeReducer,
  mainAssigneeLink: {
    body: { assigneeLinks: 1 },
    reduce: ({ assigneeLinks = [] }) =>
      assigneeLinks.find(({ isMain }) => isMain),
  },
  proNotes: proNotesReducer,
  nextDueTask: {
    body: { tasksCache: 1 },
    reduce: nextDueTaskReducer,
  },
});
