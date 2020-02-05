//
import React from 'react';

import { Percent, Money } from 'core/components/Translation';
import { REVENUE_TYPES } from 'core/api/constants';
import { adminOrganisations } from 'core/api/organisations/queries';
import { withSmartQuery } from 'core/api/containerToolkit/index';

const getLastDateinXMonths = offset => {
  const inXMonths = new Date();
  inXMonths.setMonth(inXMonths.getMonth() + offset);
  return new Date(inXMonths.getFullYear(), inXMonths.getMonth() + 1, 0);
};

const toPercentString = value => `${value * 100}%`;

const RevenueSuggestions = ({ loan, suggestRevenue, referralOrganisation }) => {
  const { lenders, structure, revenues } = loan;
  const { wantedLoan } = structure;
  const hasReferral = !!referralOrganisation;

  if (!lenders || !lenders.length) {
    return (
      <h3 className="secondary">Pas de suggestions, ajoutez des prêteurs!</h3>
    );
  }

  return (
    <div>
      <h3>Suggestions</h3>
      <div className="flex center-align wrap space-children">
        {lenders.map(lender => {
          const { organisation } = lender;
          const { commissionRates = [] } = organisation;
          const hasCommissionRate = commissionRates.length === 1;
          const commission = hasCommissionRate && commissionRates[0].rate;
          const amount = commission * wantedLoan;

          return (
            <div
              key={lender._id}
              onClick={() =>
                suggestRevenue({
                  description: hasCommissionRate
                    ? toPercentString(commission)
                    : '',
                  type: REVENUE_TYPES.MORTGAGE,
                  expectedAt: getLastDateinXMonths(3),
                  amount: hasCommissionRate ? amount : 0,
                  sourceOrganisationLink: { _id: lender.organisation._id },
                  organisationLinks: hasReferral
                    ? [
                        {
                          _id: referralOrganisation._id,
                          commissionRate: referralOrganisation.commissionRate,
                        },
                      ]
                    : [],
                })
              }
              className="card1 card-top card-hover"
            >
              <h4 style={{ marginTop: 0 }}>
                Revenus de <b>{lender.organisation.name}</b>
              </h4>
              {!hasCommissionRate && (
                <i>
                  Ajoutez un taux de commissionnement sur cette organisation
                </i>
              )}
              {hasCommissionRate && (
                <>
                  <div>Dans ~3 mois</div>
                  <div>
                    <Percent value={commission} />
                    &nbsp;de&nbsp;
                    <Money value={wantedLoan} />
                    :&nbsp;
                    <b>
                      <Money value={amount} />
                    </b>
                  </div>
                </>
              )}
              <div>
                Retrocession pour:{' '}
                <b>{hasReferral ? referralOrganisation.name : 'Personne'}</b>{' '}
                {hasReferral && (
                  <Percent value={referralOrganisation.commissionRate} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withSmartQuery({
  query: adminOrganisations,
  params: ({ loan: { user } }) => ({
    _id:
      (user &&
        user.referredByOrganisation &&
        user.referredByOrganisation._id) ||
      'none',
    $body: { name: 1, commissionRate: 1 },
  }),
  dataName: 'referralOrganisation',
  queryOptions: { single: true },
  renderMissingDoc: false,
})(RevenueSuggestions);
