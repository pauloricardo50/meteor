import Borrowers from '../borrowers';
import assigneeReducer from '../../reducers/assigneeReducer';

Borrowers.addReducers({ ...assigneeReducer() });
