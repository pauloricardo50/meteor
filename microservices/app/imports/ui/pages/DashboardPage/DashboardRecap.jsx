import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import DashboardItem from './DashboardItem';
import { T } from 'core/components/Translation';
import track from 'core/utils/analytics';

const styles = {
  recap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,
  },
  h1: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
};

class DashboardRecap extends Component {
  constructor(props) {
    super(props);

    this.state = { showDetail: false };
  }

  handleToggle = () => {
    track('dashboard recap show detail', {
      nextState: this.state.showDetail ? 'close' : 'open',
    });
    this.setState(
      prev => ({ showDetail: !prev.showDetail }),
      () => {
        this.props.reloadMasonry();
      },
    );
  };

  render() {
    let content = null;

    if (this.state.showDetail) {
      content = (
        <div style={styles.recap}>
          <Recap {...this.props} arrayName="dashboard" />
        </div>
      );
    } else {
      content = (
        <div style={styles.recap}>
          <Recap {...this.props} arrayName="dashboard-small" />
        </div>
      );
    }

    return (
      <DashboardItem
        title={<T id="DashboardRecap.title" />}
        menuActions={[
          {
            id: this.state.showDetail ? 'showOverview' : 'showDetail',
            handleClick: this.handleToggle,
          },
        ]}
      >
        {content}
      </DashboardItem>
    );
  }
}

DashboardRecap.propTypes = {
  smallWidth: PropTypes.bool.isRequired,
  hideDetail: PropTypes.bool,
  reloadMasonry: PropTypes.func.isRequired,
};

DashboardRecap.defaultProps = {
  hideDetail: false,
};

export default DashboardRecap;
