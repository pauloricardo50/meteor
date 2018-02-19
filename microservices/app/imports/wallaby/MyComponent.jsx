import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

const MyComponent = props => <div onClick={props.handleClick}>Hello World</div>;

MyComponent.propTypes = {};

export default MyComponent;
