import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import T from 'core/components/Translation';
import DashboardUnverified from '../../components/DashboardUnverified';
import AppItem from './AppItem';
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
        <AppItem
          title={<T id="AppPage.newLoan" />}
          mainText={<span className="active">+</span>}
          onClick={() => {
            window.location.replace(`${Meteor.settings.public.subdomains.www}/start/1`);
          }}
        />
      )}
    </section>
  );
};

AppPage.propTypes = {
  loans: PropTypes.arrayOf(PropTypes.object),
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppPage.defaultProps = {
  loans: [],
};

export default AppPage;
