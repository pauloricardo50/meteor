import React from 'react';
import PropTypes from 'prop-types';

import { LOAN_STATUS } from 'core/api/constants';
import Page from '../../components/Page';
import AcceptClosingModal from './AcceptClosingModal';
import DashboardProgress from './DashboardProgress';
import DashboardRecap from './DashboardRecap';
import DashboardInfo from './DashboardInfo';
import NewLoanForm from './NewLoanForm';

const DashboardPage = props => {
  const { loan } = props;
  const { name, status, logic, _id } = loan;
  const showClosedModal = status === LOAN_STATUS.DONE && !logic.acceptedClosing;
  return (
    <Page id="DashboardPage" fullWidth>
      <DashboardProgress {...props} />
      <DashboardRecap {...props} />
      <DashboardInfo {...props} />

      <NewLoanForm loan={loan} />
      {showClosedModal && <AcceptClosingModal open loan={loan} />}
    </Page>
  );
};

DashboardPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

DashboardPage.defaultProps = {};

export default DashboardPage;
