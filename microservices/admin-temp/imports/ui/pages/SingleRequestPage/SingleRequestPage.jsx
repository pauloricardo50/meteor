import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

import { getLoanValue } from 'core/utils/requestFunctions';
import { IntlNumber } from 'core/components/Translation';

import RequestTabs from './RequestTabs';
import StepStatus from './StepStatus';
import FileVerificationNotification from './FileVerificationNotification';

const styles = {
  actions: {
    margin: '80px 0',
  },
  returnButton: {
    marginBottom: 20,
  },
  recapDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 20px',
  },
};

export default class SingleRequestPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showObject: false,
      showOffers: false,
      servertime: undefined,
    };
  }

  componentDidMount() {
    Meteor.call('getServerTime', (e, res) => {
      this.setState({ serverTime: res });
    });
  }

  render() {
    const {
      history, loanRequest, borrowers, property,
    } = this.props;
    return (
      <section>
        <Button
          raised
          label="Retour"
          style={styles.returnButton}
          onClick={() => history.push('/requests')}
        />
        <div className="mask1">
          <h1>
            {loanRequest.name || 'Demande de Prêt'} - Emprunt de{' '}
            <IntlNumber
              value={getLoanValue({ loanRequest, property })}
              format="money"
            />
          </h1>

          <StepStatus {...this.props} serverTime={this.state.serverTime} />

          <FileVerificationNotification
            loanRequest={loanRequest}
            borrowers={borrowers}
          />

          <RequestTabs {...this.props} serverTime={this.state.serverTime} />
        </div>
      </section>
    );
  }
}

SingleRequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};
