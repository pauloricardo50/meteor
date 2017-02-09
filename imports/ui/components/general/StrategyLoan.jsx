import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import FinanceStrategyPicker from '/imports/ui/components/general/FinanceStrategyPicker.jsx';
import LenderPicker from '/imports/ui/components/general/LenderPicker.jsx';


const styles = {
  topSpan: {
    width: '100%',
    display: 'inline-block',
  },
  topText: {
    display: 'inline-block',
    padding: '40px 20px',
  },
  description: {
    lineHeight: '1.5em',
  },
  callButton: {
    display: 'block',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 32,
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
        <h1>Ma Stratégie de Taux</h1>

        <span style={styles.topSpan}>
          <div
            className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3"
            style={styles.topText}
          >
            <h4 style={styles.description}>
              Il n&apos;y a pas une seule stratégie parfaite pour structurer votre prêt, cependant,
              nous pouvons vous aiguiller dans la bonne direction grâce à notre expertise.
              <br />
              <br />
              Sinon, utilisez notre outil interactif ci-dessous.
            </h4>
            <span className="text-center" style={styles.callButton}>
              <RaisedButton primary label="Appeler un expert" />
            </span>
          </div>
        </span>


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
