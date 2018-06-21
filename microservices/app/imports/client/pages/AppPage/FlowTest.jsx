/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

const main = (n: number): number => n * 2;

interface Props {
  hello: string;
}

const FlowTest = (props: Props) => (
  <div>
    {main(1)} {/* This line should show an error in the editor */}
    {props.hello}
  </div>
);

FlowTest.propTypes = {
  hello: PropTypes.string.isRequired,
};

export default FlowTest;
