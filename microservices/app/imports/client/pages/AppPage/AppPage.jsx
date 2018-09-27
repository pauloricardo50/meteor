import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import T from 'core/components/Translation';
import DashboardUnverified from '../../components/DashboardUnverified';
import AppItem from './AppItem';

const AppPage = ({ currentUser: { emails, loans } }) => {
  if (loans.length === 1) {
    return <Redirect to={`/loans/${loans[0]._id}`} />;
  }

  return (
    <section id="app-page" className="app-page flex-col center">
      {!emails[0].verified && (
        <div style={{ marginBottom: 16 }}>
          <DashboardUnverified />
        </div>
      )}

      {loans.map(loan => (
        <AppItem loan={loan} key={loan._id} />
      ))}

      {loans.length === 0 && (
        <p className="description">
          <T id="AppPage.empty" />
        </p>
      )}
    </section>
  );
};

AppPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppPage.defaultProps = {};

export default AppPage;
