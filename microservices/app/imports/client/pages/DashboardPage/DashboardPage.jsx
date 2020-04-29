import React from 'react';
import PropTypes from 'prop-types';

import PageApp from '../../components/PageApp';
import DashboardInfo from './DashboardInfo';
import DashboardPageContainer from './DashboardPageContainer';
import DashboardProgress from './DashboardProgress';
import DashboardRecap from './DashboardRecap';

const DashboardPage = props => (
  <PageApp id="DashboardPage" fullWidth>
    <DashboardProgress {...props} />
    <DashboardRecap {...props} />
    <DashboardInfo {...props} />
  </PageApp>
);

DashboardPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

DashboardPage.defaultProps = {};

export default DashboardPageContainer(DashboardPage);
