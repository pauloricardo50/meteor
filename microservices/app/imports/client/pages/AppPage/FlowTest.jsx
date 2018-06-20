/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

const main = (n: number): number => n * 2;

const FlowTest = (props: object) => <div>{main('hello')}</div>;

FlowTest.propTypes = {};

export default FlowTest;
