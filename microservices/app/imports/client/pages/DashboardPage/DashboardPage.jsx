import React from 'react';
import PropTypes from 'prop-types';

import { LOAN_STATUS } from 'core/api/constants';
import Page from '../../components/Page';
import NewLoanModal from './NewLoanModal';
import AcceptClosingModal from './AcceptClosingModal';
import DashboardProgress from './DashboardProgress';
import DashboardRecap from './DashboardRecap';
import DashboardInfo from './DashboardInfo';

const DashboardPage = (props) => {
  const { loan } = props;
  const { name, status, logic, _id } = loan;
  const showNewLoanModal = !name;
  const showClosedModal = status === LOAN_STATUS.DONE && !logic.acceptedClosing;

  return (
    <Page id="DashboardPage" fullWidth>
      <DashboardProgress {...props} />
      <DashboardRecap {...props} />
      <DashboardInfo {...props} />

      {showNewLoanModal && <NewLoanModal open loanId={_id} />}

      {showClosedModal && <AcceptClosingModal open loan={loan} />}
    </Page>
  );
};

DashboardPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object),
};

DashboardPage.defaultProps = {
  borrowers: [],
};

export default DashboardPage;
