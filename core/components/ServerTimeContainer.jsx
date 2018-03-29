import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { getServerTime } from '../api';

// Get the time from the server once every 60 seconds, and update it directly
// on the client between those 60 seconds.

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

export default WrappedComponent =>
  class ServerTimeContainer extends Component {
    constructor(props) {
      super(props);

      this.state = { serverTime: undefined };
    }

    componentDidMount() {
      this.serverInterval = Meteor.setInterval(this.setServerTime, ONE_MINUTE);
      this.setServerTime();
    }

    componentWillUnmount() {
      Meteor.clearInterval(this.serverInterval);
      Meteor.clearInterval(this.clientInterval);
    }

    setServerTime = () =>
      getServerTime.run({}).then((serverTime) => {
        this.setState({ serverTime }, () => {
          Meteor.clearInterval(this.clientInterval);
          this.clientInterval = Meteor.setInterval(
            this.setClientTime,
            ONE_SECOND,
          );
        });
      });

    setClientTime = () =>
      this.setState(({ serverTime }) => ({
        serverTime: new Date(serverTime.getTime() + ONE_SECOND),
      }));

    render() {
      const { serverTime } = this.state;
      return <WrappedComponent serverTime={serverTime} {...this.props} />;
    }
  };
