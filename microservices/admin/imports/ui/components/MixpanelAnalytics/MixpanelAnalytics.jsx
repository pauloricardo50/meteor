import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MixpanelEventList from './MixpanelEventList';
import getMixpanelData from './getMixpanelData';
import groupDataByDay from './groupDataByDay';

export default class MixpanelAnalytics extends Component {
  constructor(props) {
    super(props);

    this.state = { error: false };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    console.log('mixpanel props :', this.props);

    const {
      loan: { userId },
    } = this.props;
    return getMixpanelData(userId)
      .then((data) => {
        if (data.status === 'ok') {
          this.setState({
            error: false,
            events: data.results.events,
            groupedEvents: groupDataByDay(data.results.events),
          });
        } else {
          this.setState({ error: data.status });
        }
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  render() {
    const { error, events, groupedEvents } = this.state;

    if (error) {
      return (
        <h3 className="error">Il y eu une erreur Mixpanel (status: {error})</h3>
      );
    } else if (!events) {
      return <h4>Loading...</h4>;
    }

    return (
      <div className="mixpanel-analytics">
        {events.length === 0 ? (
          <h3>Pas d'analytics pour l'instant</h3>
        ) : (
          <MixpanelEventList events={events} groupedEvents={groupedEvents} />
        )}
      </div>
    );
  }
}

MixpanelAnalytics.propTypes = {
  loan: PropTypes.object.isRequired,
};
