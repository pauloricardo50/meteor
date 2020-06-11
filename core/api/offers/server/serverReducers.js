import assigneeReducer from '../../reducers/assigneeReducer';
import Offers from '..';

Offers.addReducers({ ...assigneeReducer() });
