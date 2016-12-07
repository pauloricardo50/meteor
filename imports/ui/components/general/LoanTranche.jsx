import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues, pullValue } from '/imports/api/creditrequests/methods.js';


import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { percentMask } from '/imports/js/textMasks.js';
import { toNumber } from '/imports/js/finance-math.js';


const styles = {
  line: {
    position: 'relative',
    marginTop: 20,
    // paddingBottom: 20,
  },
  h3: {
    marginTop: 0,
  },
  close: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  dropDown: {
    zIndex: 0,
    fontSize: 'inherit',
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

    this.handleType = this.handleType.bind(this);
    this.handlePercent = this.handlePercent.bind(this);
    this.removeTranche = this.removeTranche.bind(this);
  }

  handleType(event, index, value) {
    const id = this.props.requestId;
    const object = {};
    object[`loanInfo.tranches.${this.props.index}.type`] = value;

    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Update Successful';
      }
    });
  }

  handlePercent(event) {
    const id = this.props.requestId;
    const object = {};
    object[`loanInfo.tranches.${this.props.index}.percent`] = toNumber(event.target.value);

    console.log(event.target.value);

    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Update Successful';
      }
    });
  }

  removeTranche() {
    const id = this.props.requestId;
    const value = {
      'loanInfo.tranches': { type: this.props.tranche.type }
    };

    pullValue.call({
      value, id,
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Pull Successful';
      }
    });
  }


  render() {
    return (
      <div style={styles.line} className="col-xs-12 mask2">
        <h3 className="col-xs-12" style={styles.h3}>
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
        </h3>

        {this.props.trancheArray.length > 1 &&
          <a className="fa fa-times" style={styles.close} onClick={this.removeTranche} />
        }

        <span className="col-xs-6">
          <TextField
            name="percent"
            label="Pourcent"
          >
            <MaskedInput
              onChange={this.handlePercent}
              value={this.props.tranche.percent}
              mask={percentMask}
              guide
              placeholder="%"
              pattern="[0-9]*"
            />
          </TextField>
        </span>

      </div>
    );
  }
}

LoanTranche.propTypes = {
  index: PropTypes.number.isRequired,
  tranche: PropTypes.objectOf(PropTypes.any).isRequired,
  trancheArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  requestId: PropTypes.string.isRequired,
  getRemainingTypes: PropTypes.func.isRequired,
};
