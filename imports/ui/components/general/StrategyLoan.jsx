import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { updateValues } from '/imports/api/loanrequests/methods';

import RaisedButton from 'material-ui/RaisedButton';

import FinanceStrategyPicker from '/imports/ui/components/general/FinanceStrategyPicker.jsx';
import LenderPicker from '/imports/ui/components/general/LenderPicker.jsx';


const styles = {
  backButton: {
    marginBottom: 32,
  },
  title: {
    paddingBottom: 40,
  },
  article: {
    marginBottom: 40,
  },
  choice: {
    display: 'inline-block',
    padding: 20,
    minWidth: 200,
  },
  icon: {
    paddingBottom: 20,
    color: '#D8D8D8',
  },
  picker: {
    marginTop: 40,
    display: 'inline-block',
  },
  hr: {
    display: 'inline-block',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  okButton: {
    marginTop: 32,
    float: 'right',
  },
};

export default class StrategyPage extends Component {
  constructor(props) {
    super(props);

    this.strategyChosen = this.strategyChosen.bind(this);
  }


  strategyChosen() {
    const tranches = this.props.loanRequest.general.loanTranches;
    const propertyValue = this.props.loanRequest.property.value;
    const trancheSum = tranches.reduce((total, tranche) => total + tranche.value, 0);

    return propertyValue === trancheSum;
  }

  render() {
    return (
      <section>
        <h1 style={styles.title}>Ma Stratégie de Taux</h1>

        <FinanceStrategyPicker loanRequest={this.props.loanRequest} style={styles.picker} />

        {this.strategyChosen() && <hr style={styles.hr} />}
        {this.strategyChosen() && <LenderPicker loanRequest={this.props.loanRequest} />}

      </section>
    );
  }
}

StrategyPage.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
