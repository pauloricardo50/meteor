// @flow
import React from 'react';
import LoanCards from './LoanCards';

type SuperdashboardProps = {
  currentUser: Object,
};

const Superdashboard = ({ currentUser = {} }: SuperdashboardProps) => {
  const { name, loans = [] } = currentUser;
  return (
    <div className="superdashboard">
      <div className="superdashboard-title">
        <h1>
          Bienvenue,&nbsp;
          {name}
        </h1>
        <p>Vos dossiers</p>
      </div>
      <LoanCards loans={loans} />
    </div>
  );
};

export default Superdashboard;
