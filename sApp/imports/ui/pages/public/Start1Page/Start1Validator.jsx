import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '/imports/ui/components/general/Icon';

import { T } from 'core/components/Translation';
import {
  validateRatios,
  validateRatiosCompletely,
} from '/imports/js/helpers/requestFunctions';

export default class Start1Validator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      icon: null,
      className: '',
    };
  }

  componentDidMount() {
    this.getContent(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: optimize
    this.getContent(nextProps);
  }

  getContent = ({ incomeRatio, borrowRatio }) => {
    // Use props as a paramter to be able to use nextProps
    this.setState({ ...validateRatiosCompletely(incomeRatio, borrowRatio) });
  };

  render() {
    const { message, message2, icon, className } = this.state;

    return (
      <div className="mask2 start1-errors">
        {icon && <Icon type={icon} className={`${className} icon`} />}
        <div id="content">
          <h2 className={className} style={{ margin: 0 }}>
            {message && <T id={`Start1Validator.${message}`} />}
          </h2>
          {message2 && (
            <h4 style={{ maxWidth: 400, marginBottom: 0 }}>
              <T id={`Start1Validator.${message2}`} />
            </h4>
          )}
        </div>
      </div>
    );
  }
}

Start1Validator.propTypes = {
  incomeRatio: PropTypes.number.isRequired,
  borrowRatio: PropTypes.number.isRequired,
};
