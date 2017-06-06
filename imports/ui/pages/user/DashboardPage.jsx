import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from '/imports/ui/components/general/Page.jsx';
import NewRequestModal from './dashboardPage/NewRequestModal.jsx';
import DashboardContent from './dashboardPage/DashboardContent.jsx';

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
        <DashboardContent {...this.props} smallWidth={this.state.smallWidth} />

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
