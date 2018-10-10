import Loans from '../loans';
import filesReducer from '../../reducers/filesReducer';

Loans.addReducers({ ...filesReducer });
