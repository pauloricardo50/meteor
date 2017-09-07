import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Button from '/imports/ui/components/general/Button';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

const styles = {
  mainDiv: {
    position: 'relative',
    marginBottom: 20,
  },
  h4: {
    marginTop: 0,
    display: 'flex',
  },
  trancheSpan: {
    height: 48,
    lineHeight: '56px',
    display: 'inline-block',
  },
  automaticH4: {},
  dropDown: {
    zIndex: 0,
    fontSize: 'inherit',
    marginLeft: -15,
    display: 'inline-block',
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
  interest1: 'Fixé 1 an',
  interest2: 'Fixé 2 ans',
  interest5: 'Fixé 5 ans',
  interest10: 'Fixé 10 ans',
  interest15: 'Fixé 15 ans',
};

export default class LoanTranche extends Component {
  changeType = (event, index, value) => {
    this.props.changeTrancheType(value);
  };

  render() {
    return (
      <div style={styles.mainDiv}>
        {this.props.manual
          ? <div>
              <h4 style={styles.h4}>
                <span style={styles.trancheSpan}>
                  Tranche
                </span>
                <DropDownMenu
                  value={this.props.tranche.type}
                  onChange={this.changeType}
                  autoWidth={false}
                  style={styles.dropDown}
                >
                  {this.props
                    .getRemainingTypes(this.props.tranche.type)
                    .map((type, index) => (
                      <MenuItem
                        value={type}
                        primaryText={types[type]}
                        key={index}
                      />
                    ))}
                </DropDownMenu>
              </h4>
              <br />
            </div>
          : <h4 style={styles.automaticH4}>
              Tranche {types[this.props.tranche.type]}
            </h4>}

        {this.props.manual &&
          <Button raised
            icon={<span className="fa fa-times" />}
            style={styles.deleteButton}
            buttonStyle={styles.buttonStyle}
            onClick={this.props.removeTranche}
          />}

        <div className="trancheBar">
          <div
            className="bar"
            style={{
              width: `${100 * (this.props.tranche.value / this.props.totalValue)}%`,
            }}
          />
          <div className="money">
            <h4 className="center-adjust">
              {this.props.manual &&
                <Button raised
                  label="-"
                  onClick={this.props.decrementTranche}
                  style={styles.button}
                  buttonStyle={styles.buttonStyle}
                  disabled={
                    // disable it if tranche is lower than 100000, or if it's 0 if libor
                    this.props.tranche.type === 'interestLibor'
                      ? this.props.tranche.value <= 0
                      : this.props.tranche.value <= 100000
                  }
                />}

              <span className="text-span">
                CHF {toMoney(this.props.tranche.value)}
              </span>

              {this.props.manual &&
                <Button raised
                  label="+"
                  primary
                  onClick={this.props.incrementTranche}
                  style={styles.button}
                  buttonStyle={styles.buttonStyle}
                  disabled={!this.props.moneyLeft}
                />}
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
  manual: PropTypes.bool,
};
