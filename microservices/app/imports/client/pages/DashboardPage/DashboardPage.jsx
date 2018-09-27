import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../components/Page';
import DashboardProgress from './DashboardProgress';
import DashboardRecap from './DashboardRecap';
import DashboardInfo from './DashboardInfo';
import NewLoanForm from './NewLoanForm';

const DashboardPage = props => (
  <Page id="DashboardPage" fullWidth>
    <DashboardProgress {...props} />
    <DashboardRecap {...props} />
    <DashboardInfo {...props} />

    {/* <NewLoanForm loan={loan} /> */}
  </Page>
);

DashboardPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

DashboardPage.defaultProps = {};

export default DashboardPage;
