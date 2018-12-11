import { addressReducer, tasksReducer } from '../reducers';
import Partners from './partners';

Partners.addReducers({
  name: {
    body: {
      firstName: 1,
      lastName: 1,
    },
    reduce: ({ firstName, lastName }) =>
      [firstName, lastName].filter(x => x).join(' '),
  },
  ...addressReducer,
  ...tasksReducer,
});
