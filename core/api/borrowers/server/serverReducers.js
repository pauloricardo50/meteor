import assigneeReducer from '../../reducers/assigneeReducer';
import Borrowers from '../borrowers';

Borrowers.addReducers({ ...assigneeReducer() });
