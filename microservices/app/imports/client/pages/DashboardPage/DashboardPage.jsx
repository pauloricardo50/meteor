import React from 'react';
import PropTypes from 'prop-types';

import PageApp from '../../components/PageApp';
import DashboardProgress from './DashboardProgress';
import DashboardRecap from './DashboardRecap';
import DashboardInfo from './DashboardInfo';
// import NewLoanForm from './NewLoanForm';
import DashboardPageContainer from './DashboardPageContainer';

const DashboardPage = props => (
  <PageApp id="DashboardPage" fullWidth>
    <DashboardProgress {...props} />
    <DashboardRecap {...props} />
    <DashboardInfo {...props} />
    {/* <NewLoanForm loan={loan} /> */}
  </PageApp>
);

DashboardPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

DashboardPage.defaultProps = {};

export default DashboardPageContainer(DashboardPage);
