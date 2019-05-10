import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import T from 'core/components/Translation';
import { ROLES } from 'core/api/constants';
import { WelcomeScreen } from '../../components/WelcomeScreen/WelcomeScreen';
import DashboardUnverified from '../../components/DashboardUnverified';
import AppItem from './AppItem';
import AppPageContainer from './AppPageContainer';

export const AppPage = ({
  currentUser: { emails, loans, roles },
  insertLoan,
  loading,
}) => {
  if (loans.length === 1) {
    return <Redirect to={`/loans/${loans[0]._id}`} />;
  }

  const userIsPro = roles.includes(ROLES.PRO);

  return (
    <section id="app-page" className="app-page animated fadeIn">
      {!emails[0].verified && (
        <div className="unverified-email">
          <DashboardUnverified />
        </div>
      )}

      {loans.length > 0 && (
        <h1>
          <T id="AppPage.title" />
        </h1>
      )}
      {loans.map(loan => (
        <AppItem loan={loan} key={loan._id} />
      ))}

      {loans.length === 0 && (
        <>
          <WelcomeScreen
            displayCheckbox={false}
            handleClick={insertLoan}
            buttonProps={{ loading }}
          />
          {userIsPro && (
            <p className="description">
              <br />
              <br />
              Pour accéder à votre interface e-Potek Pro, veuillez vous rendre
              sur
              {' '}
              <a className="color" href={Meteor.settings.public.subdomains.pro}>
                pro.e-potek.ch
              </a>
            </p>
          )}
        </>
      )}
    </section>
  );
};

AppPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppPage.defaultProps = {};

export default AppPageContainer(AppPage);
