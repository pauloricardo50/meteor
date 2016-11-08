import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import LenderOffersTable from '/imports/ui/components/general/LenderOffersTable.jsx';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  button: {
    padding: 100,
  },
};

export default class Step2AuctionResults extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    FlowRouter.go('/finance');
  }

  render() {
    return (
      <section className="animated fadeIn mask1">
        <h1>Les résultats sont arrivés!</h1>

        <div style={styles.button} className="text-center">
          <RaisedButton label="Choisir ma stratégie de taux" primary onClick={this.handleClick} />
        </div>

        <LenderOffersTable lenderOffers={this.props.creditRequest.lenderOffers} />

      </section>
    );
  }
}

Step2AuctionResults.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
