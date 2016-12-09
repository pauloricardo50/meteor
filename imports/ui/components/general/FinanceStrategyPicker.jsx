import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { pushValue } from '/imports/api/creditrequests/methods.js';

import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'rc-slider';

require('rc-slider/assets/index.css');

import LoanTranche from './LoanTranche.jsx';

const styles = {
  button: {
    marginRight: 8,
  },
  array: {
    marginBottom: 20,
  },
};

export default class FinanceStrategyPicker extends Component {
  constructor(props) {
    super(props);

    this.addTranch = this.addTranch.bind(this);
    this.getRemainingTypes = this.getRemainingTypes.bind(this);
  }

  addTranch() {
    const id = this.props.creditRequest._id;
    const object = {};
    object['loanInfo.tranches'] = {
      type: this.getRemainingTypes()[0],
      percent: 0,
    };

    pushValue.call({
      object, id,
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Update Successful';
      }
    });
  }

  getRemainingTypes(ignoredValue) {
    const initialChoices = [
      'libor',
      'floating',
      '1y',
      '2y',
      '5y',
      '7y',
      '10y',
    ];

    // Filter out existing values, for each remove the string if there is a match
    this.props.creditRequest.loanInfo.tranches.forEach((t) => {
      // If the value is different from the one we're currently running this from
      if (t.type !== ignoredValue) {
        const index = initialChoices.indexOf(t.type);
        if (index > -1) {
          initialChoices.splice(index, 1);
        }
      }
    });

    return initialChoices;
  }

  render() {
    const tranchesArray = [];
    this.props.creditRequest.loanInfo.tranches.forEach((tranche, index, trancheArray) => {
      tranchesArray.push(
        <LoanTranche
          key={index}
          index={index}
          tranche={tranche}
          trancheArray={trancheArray}
          requestId={this.props.creditRequest._id}
          getRemainingTypes={this.getRemainingTypes}
        />
      );
    });


    return (
      <article>
        <div className="text-center">
          <h3>Je veux diviser mon prêt en {this.props.creditRequest.loanInfo.tranches.length} tranche(s).</h3>
          <RaisedButton
            label="Ajouter une Tranche"
            onClick={this.addTranch}
            primary
            style={styles.button}
          />
        </div>

        <div className="col-xs-12" style={styles.array}>
          {tranchesArray}
        </div>

        <div className="col-xs-12">
          <Slider
            range={3}
            allowCross={false}
            pushable={5}
            defaultValue={[0, 25, 50, 75]}
          />
        </div>

      </article>
    );
  }
}

FinanceStrategyPicker.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
