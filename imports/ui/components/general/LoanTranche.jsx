import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues, pullValue } from '/imports/api/creditrequests/methods.js';


import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import { percentMask } from '/imports/js/textMasks.js';
import { toMoney, toNumber } from '/imports/js/finance-math.js';


const styles = {
  mainDiv: {
    position: 'relative',
  },
  h4: {
    marginTop: 0,
    display: 'inline-block',
  },
  dropDown: {
    zIndex: 0,
    fontSize: 'inherit',
    marginLeft: -15,
  },
  buttons: {
    display: 'inline-block',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 12,
    width: 60,
    minWidth: 'unset',
  },
  button: {
    marginRight: 16,
    width: 60,
    minWidth: 'unset',
  },
  buttonStyle: {
    width: 60,
  },
};


const types = {
  libor: 'Libor',
  floating: 'Flottant',
  '1y': 'Fixé 1 an',
  '2y': 'Fixé 2 ans',
  '5y': 'Fixé 5 ans',
  '7y': 'Fixé 7 ans',
  '10y': 'Fixé 10 ans',
};


export default class LoanTranche extends Component {
  constructor(props) {
    super(props);

    this.removeTranche = this.removeTranche.bind(this);
  }


  removeTranche() {
  }


  render() {
    return (
      <div style={styles.mainDiv}>
        <h4 style={styles.h4}>
          Tranche
          <span>
            <DropDownMenu
              value={this.props.tranche.type}
              onChange={this.handleType}
              autoWidth={false}
              style={styles.dropDown}
            >
              {this.props.getRemainingTypes(this.props.tranche.type).map((type, index) => (
                <MenuItem value={type} primaryText={types[type]} key={index} />
              ))}
            </DropDownMenu>
          </span>
        </h4>

        <div style={styles.buttons}>
          <RaisedButton
            label="-"
            onClick={this.props.decrementTranche}
            style={styles.button}
            buttonStyle={styles.buttonStyle}
            disabled={this.props.tranche.value <= 100000}
          />
          <RaisedButton
            label="+"
            primary
            onClick={this.props.incrementTranche}
            style={styles.button}
            buttonStyle={styles.buttonStyle}
            disabled={!this.props.moneyLeft}
          />
        </div>

        <RaisedButton
          icon={<span className="fa fa-times" />}
          style={styles.deleteButton}
          buttonStyle={styles.buttonStyle}
          onClick={this.props.removeTranche}
        />

        <br />

        <div className="trancheBar">
          <div className="bar" style={{
            width: `${100 * (this.props.tranche.value / this.props.totalValue)}%`
          }}
          />
          <div className="money">
            <h4 className="center-adjust">
              CHF {toMoney(this.props.tranche.value)}
            </h4>
          </div>
        </div>

      </div>
    );
  }
}

LoanTranche.propTypes = {
  index: PropTypes.number.isRequired,
  tranche: PropTypes.objectOf(PropTypes.any).isRequired,
  totalValue: PropTypes.number.isRequired,
  moneyLeft: PropTypes.number.isRequired,
  getRemainingTypes: PropTypes.func.isRequired,
  removeTranche: PropTypes.func.isRequired,
  incrementTranche: PropTypes.func.isRequired,
  decrementTranche: PropTypes.func.isRequired,
};
