import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '/imports/ui/components/general/Icon';

import { isRequestValid } from '/imports/js/helpers/requestFunctions';
import { T } from '/imports/ui/components/general/Translation';

const styles = {
  div: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '40px auto',
    padding: 40,
  },
};

export default class StructureError extends Component {
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
    const r1 = this.props.loanRequest;
    const r2 = nextProps.loanRequest;
    if (
      r1.general.fortuneUsed !== r2.general.fortuneUsed ||
      r1.general.insuranceFortuneUsed !== r2.general.insuranceFortuneUsed
    ) {
      this.getContent(nextProps);
    }
  }

  getContent = ({ loanRequest, borrowers }) => {
    try {
      if (isRequestValid(loanRequest, borrowers)) {
        this.props.setParentState('error', false);
        this.setState({
          message: 'StructureError.valid',
          icon: 'check',
          className: 'success',
        });
      }
    } catch (error) {
      this.props.setParentState('error', true);
      this.setState({
        message: `StructureError.${error.message}`,
        icon: 'close',
        className: 'error',
      });
    }
  };

  render() {
    const { message, icon, className } = this.state;
    return (
      <div style={styles.div} className="mask2 primary-border">
        {icon && (
          <Icon
            type={icon}
            style={{ marginRight: 16, height: '2em', width: '2em' }}
            className={className}
          />
        )}
        <h2 className={className} style={{ margin: 0 }}>
          {message && <T id={message} />}
        </h2>
      </div>
    );
  }
}

StructureError.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  setParentState: PropTypes.func.isRequired,
};
