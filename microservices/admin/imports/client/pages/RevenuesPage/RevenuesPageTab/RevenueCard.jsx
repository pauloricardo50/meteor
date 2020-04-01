import React from 'react';
import cx from 'classnames';
import { toMoney } from 'core/utils/conversionFunctions';

import {
  REVENUE_STATUS,
  LOANS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  INSURANCES_COLLECTION,
} from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
import Icon from 'core/components/Icon';
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
