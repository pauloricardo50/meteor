import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';

import { T } from '/imports/ui/components/general/Translation.jsx';
import getSteps from '/imports/js/arrays/steps';
import DashboardItem from './DashboardItem.jsx';

const styles = {
  button: {
    marginTop: 24,
    marginBottom: 8,
  },
  step: {
    margin: '20px 0',
  },
};

export default class DashboardStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.interval = Meteor.setInterval(() => {
      Meteor.call('getServerTime', (e, res) => {
        this.setState({ serverTime: res });
      });
    }, 10000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(this.interval);
  }

  render() {
    const { loanRequest, borrowers } = this.props;
    const steps = getSteps({ loanRequest, borrowers, serverTime: this.state.serverTime });
    const nextLink = steps[loanRequest.logic.step].items.find(subStep => !subStep.isDone()).link;

    return (
      <DashboardItem title={<T id="DashboardStatus.title" />}>
        <h2 style={styles.step}>
          <T id="DashboardStatus.step" values={{ step: loanRequest.logic.step }} />
        </h2>
        <div className="text-center" style={styles.button}>
          <RaisedButton
            label={<T id="general.continue" />}
            secondary
            containerElement={<Link to={nextLink} />}
          />
        </div>
      </DashboardItem>
    );
  }
}

DashboardStatus.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
