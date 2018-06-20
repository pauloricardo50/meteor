/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

const main = (n: number): number => n * 2;

interface FlowTestProps {
  hello: string;
}

const FlowTest = (props: FlowTestProps) => (
  <div>
    {main('hello')}
    {props.hello}
  </div>
);

FlowTest.propTypes = {};

export default FlowTest;
