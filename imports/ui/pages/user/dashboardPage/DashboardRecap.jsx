import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';

import Recap from '/imports/ui/components/general/Recap.jsx';
import DashboardItem from './DashboardItem.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

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
export default class DashboardRecap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetail: !this.props.smallWidth && this.props.loanRequest.logic.step < 3,
    };
  }

  handleToggle = () => {
    this.setState(prev => ({ showDetail: !prev.showDetail }));
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
        className="mask1"
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
};
