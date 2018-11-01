import Borrowers from '../borrowers';
import filesReducer from '../../reducers/filesReducer';
import assigneeReducer from '../../reducers/assigneeReducer';

Borrowers.addReducers({ ...filesReducer, ...assigneeReducer() });
