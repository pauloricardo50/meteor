import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


const DropdownInput = props => (
  null
);

DropdownInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
};

export default DropdownInput;
