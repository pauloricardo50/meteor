import React from 'react';
import cx from 'classnames';

import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { REVENUE_STATUS } from 'core/api/revenues/revenueConstants';
import Icon from 'core/components/Icon';
import { CollectionIconLink } from 'core/components/IconLink';
import { toMoney } from 'core/utils/conversionFunctions';

import RevenueConsolidator from '../../../components/RevenuesTable/RevenueConsolidator';
import RevenuePostponer from './RevenuePostponer';

const now = new Date();

const getIconConfig = ({ status, expectedAt, paidAt }) => {
  if (status === REVENUE_STATUS.CLOSED) {
    return { type: 'checkCircle', color: 'success', tooltip: 'Payé' };
  }

  if (expectedAt.getTime() < now.getTime()) {
    return { type: 'schedule', color: 'error', tooltip: 'En retard' };
  }

  return { type: 'schedule', color: 'warning', tooltip: 'En attente' };
};

const RevenueCard = ({
  revenue,
  withActions = true,
  setRevenueToModify = () => ({}),
  setOpenModifier = () => ({}),
  refetch = () => ({}),
}) => {
  const { amount, loan, description, sourceOrganisation, insurance } = revenue;

  return (
    <div
      className={cx('revenues-calendar-item card1 card-top', {
        'card-hover': withActions,
      })}
      onClick={() => {
        setRevenueToModify(revenue);
        setOpenModifier(true);
      }}
    >
      <div className="flex sb">
        <CollectionIconLink
          relatedDoc={
            loan
              ? { ...loan, collection: LOANS_COLLECTION }
              : { ...insurance, collection: INSURANCES_COLLECTION }
          }
        />
        <div className="flex center-align">
          <span className="mr-8">{toMoney(amount)}</span>
          <Icon {...getIconConfig(revenue)} />
          {withActions && revenue.status === REVENUE_STATUS.EXPECTED && (
            <RevenueConsolidator revenue={revenue} onSubmitted={refetch} />
          )}
          {withActions && revenue.status === REVENUE_STATUS.EXPECTED && (
            <RevenuePostponer revenue={revenue} />
          )}
        </div>
      </div>
      <div>{description}</div>
      {sourceOrganisation && (
        <div className="source-organisation">
          <CollectionIconLink
            relatedDoc={{
              ...sourceOrganisation,
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RevenueCard;
