import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { ROLES } from 'core/api/constants';
import { WelcomeScreen } from '../../components/WelcomeScreen/WelcomeScreen';
import DashboardUnverified from '../../components/DashboardUnverified';
import AppPageContainer from './AppPageContainer';
import ProAppPage from './ProAppPage';
import SuperDashboard from './SuperDashboard';

export const AppPage = ({ currentUser, insertLoan, loading }) => {
  const { emails, loans } = currentUser;
  const userIsPro = Roles.userIsInRole(currentUser, ROLES.PRO);

  if (userIsPro) {
    return <ProAppPage loans={loans} insertLoan={insertLoan} />;
  }

  if (loans.length === 1) {
    return <Redirect to={`/loans/${loans[0]._id}`} />;
  }

  return (
    <section id="app-page" className="app-page animated fadeIn">
      {!emails[0].verified && (
        <div className="unverified-email">
          <DashboardUnverified />
        </div>
      )}

      {loans.length > 0 && <SuperDashboard currentUser={currentUser} />}

      {loans.length === 0 && (
        <WelcomeScreen
          displayCheckbox={false}
          handleClick={insertLoan}
          buttonProps={{ loading }}
        />
      )}
    </section>
  );
};

AppPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppPage.defaultProps = {};

export default AppPageContainer(AppPage);
