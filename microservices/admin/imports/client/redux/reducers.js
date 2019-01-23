import { combineReducers } from 'redux';

import sidenavReducer from './sidenav';

const createRootReducer = () => combineReducers({ sidenav: sidenavReducer });

export default createRootReducer;
