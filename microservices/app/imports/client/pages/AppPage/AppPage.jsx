import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import { LOAN_STATUS } from 'core/api/constants';
import DashboardUnverified from '../../components/DashboardUnverified';
import AppItem from './AppItem';

const AppPage = ({ loans, currentUser }) => (
  <section id="app-page" className="flex-col center">
    {!currentUser.emails[0].verified && (
      <div style={{ marginBottom: 16 }}>
        <DashboardUnverified />
      </div>
    )}

    {loans.map(loan => (
      <AppItem
        key={loan._id}
        title={loan.name || <T id="AppPage.noName" />}
        subtitle={
          loan.status === LOAN_STATUS.ACTIVE ?
            <T id="AppPage.loan" />
            :
            <T id="AppPage.loan.done" />

        }
        mainText={
          loan.status === LOAN_STATUS.ACTIVE ? (
            <span>
              <T id="AppPage.step" values={{ step: loan.logic.step }} />
              {!loan.name && (
                <span>
                  <br />
                  <span className="active">
                    <T id="AppPage.begin" />
                  </span>
                </span>
              )}
            </span>
          ) :
            <span className="fa fa-home fa-2x heart-beat active" />

        }
        href={`/loans/${loan._id}`}
      />
    ))}

    <AppItem
      title={<T id="AppPage.newLoan" />}
      mainText={<span className="active">+</span>}
      onClick={() => {
        window.location.replace(`${Meteor.settings.public.subdomains.www}/start/1`);
      }}
    />
  </section>
);

AppPage.propTypes = {
  loans: PropTypes.arrayOf(PropTypes.object),
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppPage.defaultProps = {
  loans: [],
};

export default AppPage;
