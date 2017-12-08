import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MyComponent extends Component {
  render() {
    return (
      <div>
        MyComponent
        <span>
          asdfg{' '}
          <div>
            <ul>
              <li />
              <li />
              <li />
            </ul>
          </div>
        </span>
      </div>
    );
  }
}

MyComponent.propTypes = {};
