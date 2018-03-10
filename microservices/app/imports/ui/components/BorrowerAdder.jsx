import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import { addBorrower } from 'core/api';

export default class BorrowerAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => {
    const { loanId } = this.props;
    this.setState({ loading: true });
    addBorrower
      .run({ loanId })
      .then((result) => {
        console.log('Done!', result);
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { style } = this.props;
    const { loading } = this.state;

    return (
      <Button
        onClick={this.handleClick}
        disabled={loading}
        style={style}
        primary
      >
        <T id="BorrowerAdder.label" />
      </Button>
    );
  }
}

BorrowerAdder.propTypes = {
  loanId: PropTypes.string.isRequired,
  style: PropTypes.object,
};

BorrowerAdder.defaultProps = {
  style: {},
};
