import { combineReducers } from 'redux';

import widget1 from './widget1';

const createRootReducer = () => combineReducers({ widget1 });

export default createRootReducer;
