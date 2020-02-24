import ReactDOM from 'react-dom';
import React from 'react';
import moment from 'moment';

import './initialization.js';

import FrontPlugin from './components/FrontPlugin.jsx';
import './styles.scss';
import FrontErrorBoundary from './components/FrontErrorBoundary.jsx';

moment.locale('fr');
const container = document.getElementById('react-root');
ReactDOM.render(
  <FrontErrorBoundary>
    <FrontPlugin />
  </FrontErrorBoundary>,
  container,
);
