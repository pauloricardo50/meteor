import React from 'react';
import moment from 'moment';

import Tooltip from 'core/components/Material/Tooltip';
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

const RevenuesPageCalendarColumn = ({
  month,
  revenues = [],
  setRevenueToModify,
  setOpenModifier,
  refetch,
}) => {
  const { openAmount, closedAmount, totalAmount } = revenues.reduce(
    (obj, { status, amount }) => {
      if (status === REVENUE_STATUS.CLOSED) {
        return {
          ...obj,
          totalAmount: obj.totalAmount + amount,
          closedAmount: obj.closedAmount + amount,
        };
      }
      return {
        ...obj,
        totalAmount: obj.totalAmount + amount,
        openAmount: obj.openAmount + amount,
      };
    },
    { openAmount: 0, closedAmount: 0, totalAmount: 0 },
  );

  return (
    <div className="revenues-calendar-column">
      <div className="revenues-calendar-column-header">
        <div className="flex-col">
          <h4>{moment(month).format('MMMM YYYY')}</h4>
          <div>{revenues.length} revenus</div>
        </div>
        <div className="revenues-calendar-column-header-amount">
          <Tooltip title="À encaisser" placement="left">
            <div>{toMoney(openAmount)}</div>
          </Tooltip>
          <Tooltip title="Encaissé" placement="left">
            <div>{toMoney(closedAmount)}</div>
          </Tooltip>
          <hr />
          <Tooltip title="Total pour le mois si tout va bien" placement="left">
            <b>{toMoney(totalAmount)}</b>
          </Tooltip>
        </div>
      </div>

      {revenues.map(revenue => {
        const {
          _id,
          amount,
          loan,
          description,
          sourceOrganisation,
          insurance,
        } = revenue;

        return (
          <div
            className="revenues-calendar-item card1 card-top card-hover"
            key={_id}
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
                {revenue.status === REVENUE_STATUS.EXPECTED && (
                  <RevenueConsolidator
                    revenue={revenue}
                    onSubmitted={refetch}
                  />
                )}
                {revenue.status === REVENUE_STATUS.EXPECTED && (
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
      })}
    </div>
  );
};

export default RevenuesPageCalendarColumn;
