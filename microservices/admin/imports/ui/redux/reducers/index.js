import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import sidenav from './sidenav';

const createRootReducer = () => combineReducers({ sidenav, form: formReducer });

export default createRootReducer;
