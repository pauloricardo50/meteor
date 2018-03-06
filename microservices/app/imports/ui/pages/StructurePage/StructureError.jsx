import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';

import { isLoanValid } from 'core/utils/loanFunctions';
import { T } from 'core/components/Translation';
import withLoan from 'core/containers/withLoan';

const styles = {
  div: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '40px auto',
    padding: 40,
  },
};

class StructureError extends Component {
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
    const r1 = this.props.loan;
    const r2 = nextProps.loan;
    if (
      r1.general.fortuneUsed !== r2.general.fortuneUsed ||
      r1.general.insuranceFortuneUsed !== r2.general.insuranceFortuneUsed
    ) {
      this.getContent(nextProps);
    }
  }

  getContent = ({ loan, borrowers, property }) => {
    try {
      if (isLoanValid({ loan, borrowers, property })) {
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
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
  setParentState: PropTypes.func.isRequired,
};

export default withLoan(StructureError);
