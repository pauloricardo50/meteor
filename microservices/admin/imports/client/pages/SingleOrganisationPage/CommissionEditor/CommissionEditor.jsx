// @flow
import React from 'react';

import CommissionRatesViewer from 'core/components/CommissionRatesViewer';
import CommissionRatesForm from './CommissionRatesForm';

const CommissionEditor = ({ commissionRates = [], _id: organisationId }) => (
  <div>
    <CommissionRatesForm
      commissionRates={commissionRates}
      organisationId={organisationId}
    />
    {commissionRates.length === 0 ? (
      <>
        <p className="description">
          Commissions <span className="error">désactivées</span>
          <br />
          Tant qu'il n'y a aucun taux de commissionnement sur cette
          organisation, les utilisateurs PRO n'auront pas accès aux
          fonctionalités suivantes:
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
      commissionRates={commissionRates}
    />
  </div>
);

export default CommissionEditor;
