import React from 'react';

import CommissionRatesViewer from 'core/components/CommissionRatesViewer';
import CommissionRatesForm from './CommissionRatesForm';

const CommissionEditor = props => {
  const { commissionRates = [], _id: organisationId } = props;
  console.log('commissionRates:', commissionRates);
  const [{ rates = [] }] = commissionRates;

  return (
    <div>
      <CommissionRatesForm
        commissionRates={rates}
        organisationId={organisationId}
      />
      {rates.length === 0 ? (
        <>
          <p className="description">
            Commissions <span className="error">désactivées</span>
            <br />
            Tant qu'il n'y a aucun taux de commissionnement sur cette
            organisation, les comptes Pro n'auront pas accès aux fonctionalités
            suivantes:
          </p>
          <ul>
            <li>Onglet Revenus dans la sidenav</li>
            <li>Onglet Commission sur leur page d'organisation</li>
          </ul>
        </>
      ) : (
        <p className="description">
          Commissions <span className="success">activées</span>
        </p>
      )}
      <hr />
      <CommissionRatesViewer
        organisationId={organisationId}
        commissionRates={rates}
      />
    </div>
  );
};

export default CommissionEditor;
