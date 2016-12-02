import React, { Component, PropTypes } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import TextInputNumber from '../forms/TextInputNumber.jsx';

const styles = {
  line: {
    // paddingTop: 20,
    // paddingBottom: 20,
  },
};

export default class LoanTranche extends Component {
  constructor(props) {
    super(props);

    this.state = { value: 1 };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }


  render() {
    return (
      <span style={styles.line} className="col-xs-12">
        <span className="col-xs-6">
          <TextInputNumber
            label="Pourcent"
          />
        </span>
        <span className="col-xs-6">
          <DropDownMenu
            value={this.state.value}
            onChange={this.handleChange}
            autoWidth={false}
          >
            <MenuItem value={1} primaryText="Libor" />
            <MenuItem value={2} primaryText="Fixe 2 ans" />
            <MenuItem value={3} primaryText="Fixe 5 ans" />
            <MenuItem value={4} primaryText="Fixe 10 ans" />
          </DropDownMenu>
        </span>
        <hr />
      </span>
    );
  }
}

LoanTranche.propTypes = {
};
