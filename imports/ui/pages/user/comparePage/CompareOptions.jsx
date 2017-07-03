import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import DefaultOptions from './DefaultOptions.jsx';
import AdvancedOptions from './AdvancedOptions.jsx';

export default class CompareOptions extends Component {
  constructor(props) {
    super(props);

    this.state = { showAdvanced: false };
  }

  handleClick = callback =>
    this.setState(prev => ({ showAdvanced: !prev.showAdvanced }), callback);

  render() {
    const { showAdvanced } = this.state;
    return (
      <div
        className="mask1"
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}
      >
        <DefaultOptions {...this.props} />
        {showAdvanced && <AdvancedOptions {...this.props} />}
        <div className="text-center">
          <RaisedButton
            onClick={this.handleClick}
            label={
              showAdvanced
                ? 'CompareOptions.hideAdvanced'
                : 'CompareOptions.showAdvanced'
            }
          />
        </div>
      </div>
    );
  }
}

CompareOptions.propTypes = {};
