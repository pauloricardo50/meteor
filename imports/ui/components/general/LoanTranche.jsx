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
    width: 60,
    minWidth: 'unset',
  },
  buttonStyle: {
    width: 60,
  },
};


const types = {
  interestLibor: 'Libor',
  interestFloating: 'Flottant',
  interest1: 'Fixé 1 an',
  interest2: 'Fixé 2 ans',
  interest5: 'Fixé 5 ans',
  interest7: 'Fixé 7 ans',
  interest10: 'Fixé 10 ans',
  interest15: 'Fixé 15 ans',
};


export default class LoanTranche extends Component {
  constructor(props) {
    super(props);

    this.changeType = this.changeType.bind(this);
  }

  changeType(event, index, value) {
    this.props.changeTrancheType(value);
  }

  render() {
    return (
      <div style={styles.mainDiv}>
        <h4 style={styles.h4}>
          <span>
          Tranche
            <DropDownMenu
              value={this.props.tranche.type}
              onChange={this.changeType}
              autoWidth={false}
              style={styles.dropDown}
            >
              {this.props.getRemainingTypes(this.props.tranche.type).map((type, index) => (
                <MenuItem value={type} primaryText={types[type]} key={index} />
              ))}
            </DropDownMenu>
          </span>
        </h4>

        {/* <div style={styles.buttons}>
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
        </div> */}

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
              <RaisedButton
                label="-"
                onClick={this.props.decrementTranche}
                style={styles.button}
                buttonStyle={styles.buttonStyle}
                disabled={this.props.tranche.value <= 100000}
              />
              <span className="text-span">
                CHF {toMoney(this.props.tranche.value)}
              </span>
              <RaisedButton
                label="+"
                primary
                onClick={this.props.incrementTranche}
                style={styles.button}
                buttonStyle={styles.buttonStyle}
                disabled={!this.props.moneyLeft}
              />
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
  changeTrancheType: PropTypes.func.isRequired,
};
