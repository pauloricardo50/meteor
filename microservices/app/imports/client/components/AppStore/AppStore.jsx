import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import createStore from '../../redux';

const store = createStore();

const AppStore = ({ children }) =>
  <Provider store={store}>{children}</Provider>;
AppStore.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppStore;
