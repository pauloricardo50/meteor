import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

import { T } from '/imports/ui/components/general/Translation.jsx';
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
    const { message, message2, icon: MyIcon, className } = this.state;

    return (
      <div className="mask2 start1-errors">
        {MyIcon && <MyIcon className={`${className} icon`} />}
        <div id="content">
          <h2 className={className} style={{ margin: 0 }}>
            {message && <T id={`Start1Validator.${message}`} />}
          </h2>
          {message2 &&
            <h4 style={{ maxWidth: 400, marginBottom: 0 }}>
              <T id={`Start1Validator.${message2}`} />
            </h4>}
        </div>
      </div>
    );
  }
}

Start1Validator.propTypes = {
  incomeRatio: PropTypes.number.isRequired,
  borrowRatio: PropTypes.number.isRequired,
};
