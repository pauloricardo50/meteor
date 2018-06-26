import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import T from 'core/components/Translation';
import DashboardUnverified from '../../components/DashboardUnverified';
import LoanAppItem from './LoanAppItem';

const AppPage = ({ loans, currentUser }) => {
  if (loans.length === 1) {
    return <Redirect to={`/loans/${loans[0]._id}`} />;
  }

  return (
    <section id="app-page" className="flex-col center">
      {!currentUser.emails[0].verified && (
        <div style={{ marginBottom: 16 }}>
          <DashboardUnverified />
        </div>
      )}

      {loans.map(loan => <LoanAppItem loan={loan} key={loan._id} />)}

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
  loans: PropTypes.arrayOf(PropTypes.object),
};

AppPage.defaultProps = {
  loans: [],
};

export default AppPage;
