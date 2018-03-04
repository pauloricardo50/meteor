import { combineReducers } from 'redux';
import sidenav from './sidenav';

const createRootReducer = () => combineReducers({ sidenav });

export default createRootReducer;
