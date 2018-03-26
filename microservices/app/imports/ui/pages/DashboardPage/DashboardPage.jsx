import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from '/imports/ui/components/Page';
import NewLoanModal from './NewLoanModal';
import AcceptClosingModal from './AcceptClosingModal';
import DashboardContent from './DashboardContent';
import DashboardProgress from './DashboardProgress';

import { getWidth } from 'core/utils/browserFunctions';
import { LOAN_STATUS } from 'core/api/constants';

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
    const { loan } = this.props;
    const showNewLoanModal = !loan.name;
    const showClosedModal =
      loan.status === LOAN_STATUS.DONE && !loan.logic.acceptedClosing;

    return (
      <Page id="DashboardPage" className="joyride-dashboard" fullWidth>
        <DashboardProgress {...this.props} />

        <DashboardContent {...this.props} smallWidth={this.state.smallWidth} />

        {showNewLoanModal && <NewLoanModal open loanId={loan._id} />}

        {showClosedModal && <AcceptClosingModal open loan={loan} />}
      </Page>
    );
  }
}

DashboardPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object),
};

DashboardPage.defaultProps = {
  borrowers: [],
};
