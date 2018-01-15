import { combineReducers } from 'redux';
import { createCollectionReducers } from 'core/redux/reducers/utils';
import stepper from './stepper';

const createRootReducer = ({ collections }) => {
  const collectionReducers = createCollectionReducers(collections);

  return combineReducers({ stepper, ...collectionReducers });
};

export default createRootReducer;
