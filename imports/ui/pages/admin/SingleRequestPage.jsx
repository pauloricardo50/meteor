import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import RequestTabs from './singleRequestPage/RequestTabs.jsx';
import StepStatus from './singleRequestPage/StepStatus.jsx';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import adminActions from '/imports/js/arrays/adminActions';
import { getLoanValue } from '/imports/js/helpers/requestFunctions';

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
    const actions = adminActions(this.props.loanRequest, this.props);
    return (
      <section>
        <RaisedButton
          label="Retour"
          style={styles.returnButton}
          onTouchTap={() => this.props.history.push('/admin/requests')}
        />
        <div className="mask1">
          <h1>
            {this.props.loanRequest.name || 'Demande de Prêt'} - Emprunt de CHF&nbsp;
            {toMoney(getLoanValue(this.props.loanRequest))}
          </h1>

          <StepStatus {...this.props} serverTime={this.state.serverTime} />

          {/* <div className="text-center" style={styles.actions}>
            {actions.length > 0
              ? actions.map((action, i) => (
                <div key={i} className="form-group">
                  <RaisedButton label={action.label} onClick={action.handleClick} primary />
                </div>
                ))
              : <h2 className="secondary">Aucune action à prendre</h2>}
          </div> */}

          <RequestTabs {...this.props} serverTime={this.state.serverTime} />
        </div>
      </section>
    );
  }
}

SingleRequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
