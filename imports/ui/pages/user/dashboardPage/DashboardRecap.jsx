import React, { PropTypes } from 'react';

import Recap from '/imports/ui/components/general/Recap.jsx';

import FlatButton from 'material-ui/FlatButton';

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
      <div className="mask1">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h4 className="fixed-size bold" style={{ marginTop: 0 }}>
            <T id="DashboardRecap.title" />
          </h4>
          <FlatButton
            label={
              this.state.showDetail
                ? <T id="DashboardRecap.overview" />
                : <T id="DashboardRecap.detail" />
            }
            onTouchTap={this.handleToggle}
            primary
          />
        </div>
        {content}
      </div>
    );
  }
}

DashboardRecap.propTypes = {
  smallWidth: PropTypes.bool.isRequired,
};
