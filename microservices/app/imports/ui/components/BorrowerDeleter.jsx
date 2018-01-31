import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ConfirmButton from '../components/ConfirmButton';
import cleanMethod from 'core/api/cleanMethods';
import IconButton from 'core/components/IconButton';
import { T } from 'core/components/Translation';

export default class BorrowerDeleter extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  handleClick = () => {
    const { borrowerId, loanId } = this.props;
    this.setState({ loading: true });
    return cleanMethod('removeBorrower', { borrowerId, loanId })
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  };

  render() {
    const { loading } = this.state;
    return (
      <ConfirmButton
        disabled={loading}
        handleClick={this.handleClick}
        buttonComponent={
          <IconButton
            type={loading ? 'loop-spin' : 'close'}
            tooltip={<T id="general.delete" />}
          />
        }
      />
    );
  }
}

BorrowerDeleter.propTypes = {
  borrowerId: PropTypes.string.isRequired,
  loanId: PropTypes.string.isRequired,
};
