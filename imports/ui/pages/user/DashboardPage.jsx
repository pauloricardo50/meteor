import React from 'react';
import PropTypes from 'prop-types';

import DashboardItem from './dashboardPage/DashboardItem.jsx';
import NewRequestModal from './dashboardPage/NewRequestModal.jsx';

const DashboardPage = props => {
  return (
    <section>
      <h1>Tableau de Bord</h1>
      <DashboardItem {...props} loanRequest={props.loanRequest} borrowers={props.borrowers} />

      {!props.loanRequest.name &&
        <NewRequestModal open requestId={props.loanRequest._id} history={props.history} />}
    </section>
  );
};

DashboardPage.defaultProps = {
  loanRequest: undefined,
  borrowers: [],
};

DashboardPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
};

export default DashboardPage;
