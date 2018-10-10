import Borrowers from '../borrowers';
import filesReducer from '../../reducers/filesReducer';

Borrowers.addReducers({ ...filesReducer });
