import React from 'react';

import T from 'core/components/Translation';
import RevenuesByStatus from 'core/components/RevenuesByStatus';
import Select from 'core/components/Select';
import ProRevenuesPipelineContainer from './ProRevenuesPipelineContainer';
import ProRevenuesPageExplained from './ProRevenuesExplained';

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
  const anonymousLoans = loans.filter(({ anonymous }) => anonymous);
  const claimedLoans = loans.filter(({ anonymous }) => !anonymous);

  return (
    <div>
      <h2>Pipeline</h2>

      <h3 className="secondary">
        <T id="ProRevenuesPage.loanCount" values={{ value: loans.length }} />
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
            { id: true, label: 'Tous' },
            {
              id: organisationId,
              label: (
                <span>
                  <span className="secondary">Organisation:&nbsp;</span>
                  {organisationName}
                </span>
              ),
            },
            { id: 'referral', label: 'Referrals en personne' },
            { id: 'SELECT_GROUP', label: 'Referrals par agent' },
            ...users.map(({ _id, name }) => ({ id: _id, label: name })),
          ]}
          className="mr-8"
        />
      </div>
      <RevenuesByStatus loans={loans} multiplier={commissionRate} />
    </div>
  );
};

export default ProRevenuesPipelineContainer(ProRevenuesPipeline);
