import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from 'core/components/Button';

import track from 'core/utils/analytics';
import cleanMethod from 'core/api/cleanMethods';
import { LoadingComponent } from 'core/components/Loading';
import { T } from 'core/components/Translation';
import getSteps from 'core/arrays/steps';
import { AUCTION_STATUS } from 'core/api/constants';
import DashboardItem from './DashboardItem';
import withLoan from 'core/containers/withLoan';

const styles = {
  button: {
    marginTop: 24,
    marginBottom: 8,
  },
  step: {
    margin: '20px 0',
  },
};

class DashboardStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const setTime = () =>
      Meteor.call('getServerTime', (e, res) => {
        this.setState({ serverTime: res });
      });
    setTime();

    this.interval = Meteor.setInterval(() => {
      setTime();
    }, 10000);
  }

  componentWillUnmount() {
    Meteor.clearInterval(this.interval);
  }

  getNextLink = () => {
    const { loan, borrowers, property } = this.props;
    const steps = getSteps({
      loan,
      borrowers,
      property,
      serverTime: this.state.serverTime,
    });
    const nextItem = steps[loan.logic.step].items.find(subStep => !subStep.isDone());
    return nextItem && nextItem.link;
  };

  handleNextStep = () =>
    cleanMethod('incrementStep', { id: this.props.loan._id }).then(() =>
      this.props.history.push(this.getNextLink()));

  render() {
    const { loan, borrowers } = this.props;
    const { serverTime } = this.state;
    const nextLink = this.getNextLink();

    const verificationRequested =
      loan.logic.verification &&
      loan.logic.verification.requested;
    const auctionGoingOn =
      loan.logic.auction.status === AUCTION_STATUS.STARTED;

    const showLoading = verificationRequested || auctionGoingOn;

    return (
      <DashboardItem title={<T id="DashboardStatus.title" />}>
        <h2 className="fixed-size" style={styles.step}>
          <T
            id="DashboardStatus.step"
            values={{ step: loan.logic.step }}
          />
          {showLoading && <br />}
          {showLoading && (
            <small>
              <T
                id={
                  verificationRequested
                    ? 'DashboardStatus.verification'
                    : 'DashboardStatus.auction'
                }
              />
            </small>
          )}
        </h2>
        {showLoading && (
          <div style={{ height: 80 }}>
            <LoadingComponent />
          </div>
        )}
        <div className="text-center" style={styles.button}>
          <Button
            raised
            label={<T id="general.continue" />}
            secondary
            link={!!nextLink}
            to={nextLink}
            onClick={() => {
              track('clicked dashboard status button', { nextLink });
              if (!nextLink) {
                this.handleNextStep();
              }
            }}
          />
        </div>
      </DashboardItem>
    );
  }
}

DashboardStatus.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withLoan(DashboardStatus);
