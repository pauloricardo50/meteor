import PropTypes from 'prop-types';
import React from 'react';

import MetricsTriple from 'core/components/MetricsTriple';
import ActionsTable from '/imports/ui/components/ActionsTable';

const getUserMetrics = (props) => {
  const d1 = new Date();
  const d2 = new Date();
  d1.setDate(d1.getDate() - 7);
  d2.setDate(d2.getDate() - 30);

  return [
    {
      name: 'Total Utilisateurs',
      value: props.users.length,
    },
    {
      name: 'Derniers 7 jours',
      value: `+${
        props.users.filter(user => user.createdAt.getTime() >= d1).length
      }`,
    },
    {
      name: 'Derniers 30 jours',
      value: `+${
        props.users.filter(user => user.createdAt.getTime() >= d2).length
      }`,
    },
  ];
};

const AdminDashboardPage = (props) => {
  const now = new Date();
  return (
    <section className="mask1">
      <h1>Admin Dashboard</h1>

      <MetricsTriple metrics={getUserMetrics(props)} percent={false} />

      <ActionsTable
        loans={props.loans}
        recentOffers={props.offers.filter(offer => offer.auctionEndTime >= now)}
        history={props.history}
        adminActions={props.adminActions}
      />
    </section>
  );
};

AdminDashboardPage.defaultProps = {
  adminActions: [],
  loans: [],
  users: [],
  offers: [],
};

AdminDashboardPage.propTypes = {
  adminActions: PropTypes.arrayOf(PropTypes.object),
  loans: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};

export default AdminDashboardPage;
