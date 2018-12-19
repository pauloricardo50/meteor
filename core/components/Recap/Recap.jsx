import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import RecapSimple from './RecapSimple';
import {
  getDashboardArray,
  getBorrowerArray,
  getStructureArray,
  getPropertyArray,
  getNotaryFeesArray,
} from './recapArrays';

const arraySwitch = (props) => {
  switch (props.arrayName) {
  case 'start1':
    return null;
  case 'dashboard':
    return getDashboardArray(props);
  case 'borrower':
    return getBorrowerArray(props);
  case 'structure':
    return getStructureArray(props);
  case 'property':
    return getPropertyArray(props);
  case 'notaryFees':
    return getNotaryFeesArray(props);
  default:
    throw new Meteor.Error('Not a valid recap array');
  }
};

const Recap = (props) => {
  const array = props.array || arraySwitch(props);
  return (
    <div className="validator recap">
      <RecapSimple {...props} array={array} />
    </div>
  );
};

Recap.propTypes = {
  array: PropTypes.arrayOf(PropTypes.object),
  borrower: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  loan: PropTypes.objectOf(PropTypes.any),
  noScale: PropTypes.bool,
};

Recap.defaultProps = {
  loan: {},
  borrowers: [{}],
  borrower: {},
  array: undefined,
  noScale: false,
};

export default Recap;
