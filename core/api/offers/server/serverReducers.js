import Offers from '..';
import assigneeReducer from '../../reducers/assigneeReducer';

Offers.addReducers({ ...assigneeReducer() });
