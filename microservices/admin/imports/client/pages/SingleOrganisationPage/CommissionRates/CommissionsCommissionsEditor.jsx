import React from 'react';
import { withProps } from 'recompose';

import { COMMISSION_RATES_TYPE } from 'core/api/commissionRates/commissionRateConstants';

import CommissionsEditor from './CommissionsEditor';

export default withProps(({ commissionRates = [] }) => {
  const [commissionCommissionRates = {}] = commissionRates.filter(
    ({ type }) => type === COMMISSION_RATES_TYPE.COMMISSIONS,
  );

  return {
    commissionRates: {
      ...commissionCommissionRates,
      type: COMMISSION_RATES_TYPE.COMMISSIONS,
    },
    emptyState: (
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
    ),
  };
})(CommissionsEditor);
