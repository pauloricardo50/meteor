import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import WwwRouter from './WwwRouter';

const start = () => {
  console.log('starting!!');

  render(WwwRouter(), document.getElementById('react-root'));
};

Meteor.startup(start);
