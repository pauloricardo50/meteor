import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from '/imports/ui/components/general/Page.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';
import NewRequestModal from './dashboardPage/NewRequestModal.jsx';
import DashboardRecap from './dashboardPage/DashboardRecap.jsx';
import DashboardCharts from './dashboardPage/DashboardCharts.jsx';
import DashboardBorrowers from './dashboardPage/DashboardBorrowers.jsx';
import DashboardLastSteps from './dashboardPage/DashboardLastSteps.jsx';

import { getWidth } from '/imports/js/helpers/browserFunctions';

export default class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = { smallWidth: getWidth() < 768 };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({ smallWidth: getWidth() < 768 });
  };

  render() {
    return (
      <Page id="DashboardPage" className="joyride-dashboard">
        <div className="container-fluid" style={{ width: '100%', padding: 0 }}>

          <div className="col-md-6 col-lg-4 joyride-recap" style={{ marginBottom: 15 }}>

            {this.props.loanRequest.logic.step === 3 && <DashboardLastSteps {...this.props} />}

            <DashboardRecap {...this.props} smallWidth={this.state.smallWidth} />
          </div>

          {/* <div className="col-md-6 col-lg-8"> */}
          <div className="col-md-6 col-lg-4 joyride-charts" style={{ marginBottom: 15 }}>
            <DashboardCharts {...this.props} />
          </div>

          <div className="col-md-6 col-lg-4 joyride-borrowers" style={{ marginBottom: 15 }}>
            <DashboardBorrowers {...this.props} />
          </div>
        </div>

        {!this.props.loanRequest.name &&
          <NewRequestModal
            open
            requestId={this.props.loanRequest._id}
            history={this.props.history}
          />}
      </Page>
    );
  }
}

DashboardPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object),
};

DashboardPage.defaultProps = {
  borrowers: [],
};
