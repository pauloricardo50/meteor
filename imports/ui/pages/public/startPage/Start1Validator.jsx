import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  div: {
    // display: 'inline-flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // margin: '40px auto',
    // padding: 40,
  },
  content: {
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
  },
};

const validate = (incomeRatio, borrowRatio) => {
  // To prevent rounding errors
  const incomeRatioSafe = incomeRatio - 0.001;
  const borrowRatioSafe = borrowRatio - 0.001;

  if (incomeRatioSafe > 0.38) {
    throw new Error('income');
  } else if (incomeRatioSafe > 1 / 3) {
    throw new Error('incomeTight');
  } else if (borrowRatioSafe > 0.9) {
    throw new Error('fortune');
  } else if (borrowRatioSafe > 0.8) {
    throw new Error('fortuneTight');
  }
};

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
    try {
      validate(incomeRatio, borrowRatio);
      this.setState({
        message: 'Start1Validator.valid',
        message2: '',
        icon: CheckIcon,
        className: 'success',
      });
    } catch (error) {
      const isTight = error.message.indexOf('Tight');
      this.setState({
        message: `Start1Validator.${error.message}`,
        message2: `Start1Validator.${error.message}2`,
        icon: isTight ? WarningIcon : CloseIcon,
        className: isTight ? 'warning' : 'error',
      });
    }
  };

  render() {
    const { message, message2, icon: MyIcon, className } = this.state;

    return (
      <div style={styles.div} className="mask2 primary-border start1-errors">
        {MyIcon &&
          <MyIcon
            // style={{ marginRight: '2em', height: '3em', width: '3em' }}
            className={className + ' icon'}
          />}
        <div style={styles.content} id="content">
          <h2 className={className} style={{ margin: 0 }}>
            {message && <T id={message} />}
          </h2>
          {message2 &&
            <h4 style={{ maxWidth: 400, marginBottom: 0 }}>
              <T id={message2} />
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
