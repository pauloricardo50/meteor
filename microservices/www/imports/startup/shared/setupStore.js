import createStore from '../../redux';
import * as startupConstants from './startupConstants';

let preloadedState = {};

if (global && global.window) {
  preloadedState = window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line
  delete window[startupConstants.REDUX_STORE_KEY]; // eslint-disable-line
}

export const { store, persistor } = createStore({
  initialState: preloadedState,
});
