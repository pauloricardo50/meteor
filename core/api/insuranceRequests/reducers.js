import InsuranceRequests from '.';
import mainAssigneeReducer from '../reducers/mainAssigneeReducer';
import proNotesReducer from '../reducers/proNotesReducer';
import nextDueTaskReducer from '../reducers/nextDueTaskReducer';

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
