import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  backButton: {
    marginBottom: 20,
  },
}

export default class AdminOfferPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <RaisedButton
          label="Retour"
          onClick={() => Session.get('lastRoute') && FlowRouter.go(Session.get('lastRoute'))}
          style={styles.backButton}
          disabled={!Session.get('lastRoute')}
        />
        <section className="mask1">
          Salut!
        </section>
      </div>
    );
  }
}

AdminOfferPage.defaultProps = {
  offer: {},
};

AdminOfferPage.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any),
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
