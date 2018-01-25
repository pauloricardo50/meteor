import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from '/imports/ui/components/Page';
import NewRequestModal from './NewRequestModal';
import AcceptClosingModal from './AcceptClosingModal';
import DashboardContent from './DashboardContent';

import { getWidth } from 'core/utils/browserFunctions';
import { REQUEST_STATUS } from 'core/api/constants';

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

  resize = () => this.setState({ smallWidth: getWidth() < 768 });

  render() {
    const { loanRequest, history } = this.props;
    const showNewRequestModal = !loanRequest.name;
    const showClosedModal =
      loanRequest.status === REQUEST_STATUS.DONE &&
      !loanRequest.logic.acceptedClosing;

    return (
      <Page id="DashboardPage" className="joyride-dashboard" fullWidth>
        <DashboardContent {...this.props} smallWidth={this.state.smallWidth} />

        {showNewRequestModal && (
          <NewRequestModal open requestId={loanRequest._id} />
        )}

        {showClosedModal && (
          <AcceptClosingModal open loanRequest={loanRequest} />
        )}
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
