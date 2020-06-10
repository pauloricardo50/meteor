import React from 'react';

import RevenuesByStatus from 'core/components/RevenuesByStatus';
import Select from 'core/components/Select';
import T from 'core/components/Translation';

import ProRevenuesPageExplained from './ProRevenuesExplained';
import ProRevenuesPipelineContainer from './ProRevenuesPipelineContainer';

const ProRevenuesPipeline = ({
  loans = [],
  organisation: {
    _id: organisationId,
    commissionRate = 0,
    name: organisationName,
    users,
  },
  withAnonymous,
  setWithAnonymous,
  referredByUserId,
  setReferredByUserId,
}) => {
  const noPromotionLoans = loans.filter(
    ({ promotionLinks }) => !promotionLinks?.length,
  );
  const anonymousLoans = noPromotionLoans.filter(({ anonymous }) => anonymous);
  const claimedLoans = noPromotionLoans.filter(({ anonymous }) => !anonymous);
  const promotionLoansCount = loans.length - noPromotionLoans.length;

  return (
    <div>
      <h2>Pipeline</h2>

      <h3 className="secondary">
        <T
          id="ProRevenuesPage.loanCount"
          values={{ value: noPromotionLoans.length }}
        />
        {anonymousLoans.length > 0 && (
          <T
            id="ProRevenuesPage.loanCountAnonymous"
            values={{
              anonymousCount: anonymousLoans.length,
              claimedCount: claimedLoans.length,
            }}
          />
        )}
      </h3>
      {promotionLoansCount > 0 && (
        <div className="secondary mt-0">
          <T
            id="ProRevenuesPage.promotionLoans"
            values={{ count: promotionLoansCount }}
          />
        </div>
      )}
      <ProRevenuesPageExplained />
      <div className="flex" style={{ marginTop: 16 }}>
        <Select
          label="Anonymes"
          value={withAnonymous}
          onChange={setWithAnonymous}
          options={[
            { id: true, label: 'Avec' },
            { id: false, label: 'Sans' },
          ]}
          className="mr-8"
        />
        <Select
          label="Référé par"
          value={referredByUserId}
          onChange={setReferredByUserId}
          options={[
            { id: true, label: <T id="general.all" /> },
            {
              id: organisationId,
              label: (
                <span>
                  <span className="secondary">Organisation:&nbsp;</span>
                  {organisationName}
                </span>
              ),
            },
            {
              id: 'referral',
              label: <T id="ProRevenuesPipeline.referredByUser" />,
            },
            {
              id: 'SELECT_GROUP',
              label: <T id="ProRevenuesPipeline.referredByUser.group" />,
            },
            ...users.map(({ _id, name }) => ({ id: _id, label: name })),
          ]}
          className="mr-8"
        />
      </div>
      <RevenuesByStatus loans={noPromotionLoans} multiplier={commissionRate} />
    </div>
  );
};

export default ProRevenuesPipelineContainer(ProRevenuesPipeline);
