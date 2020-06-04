import React, { useState } from 'react';
import { withProps } from 'recompose';

import { PROMOTION_LOTS_COLLECTION } from '../../../../api/promotionLots/promotionLotConstants';
import { proPromotionLots } from '../../../../api/promotionLots/queries';
import StatusLabel from '../../../StatusLabel';
import T, { Money } from '../../../Translation';
import PromotionCustomer from '../PromotionCustomer';
import LotChip from './LotChip';
import PromotionLotGroupChip from './PromotionLotGroupChip';

const getProColumns = promotion => {
  const {
    promotionLotGroups = [],
    loans = [],
    users: promotionUsers = [],
  } = promotion;

  return [
    {
      Header: <T id="PromotionPage.lots.name" />,
      accessor: 'name',
    },
    {
      Header: <T id="PromotionPage.lots.group" />,
      accessor: 'promotionLotGroupIds',
      Cell: ({ value: promotionLotGroupIds = [] }) => (
        <div>
          {promotionLotGroupIds.map(promotionLotGroupId => {
            const promotionLotGroup = promotionLotGroups.find(
              ({ id }) => id === promotionLotGroupId,
            );

            return (
              promotionLotGroup && (
                <PromotionLotGroupChip
                  key={promotionLotGroupId}
                  promotionLotGroup={promotionLotGroup}
                />
              )
            );
          })}
        </div>
      ),
      disableSortBy: true,
    },
    {
      Header: <T id="PromotionPage.lots.status" />,
      accessor: 'status',
      Cell: ({ value: status }) => (
        <StatusLabel status={status} collection={PROMOTION_LOTS_COLLECTION} />
      ),
    },
    {
      Header: <T id="PromotionPage.lots.totalValue" />,
      accessor: 'value',
      align: 'right',
      disableSortBy: true,
      Cell: ({ value }) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {typeof value === 'number' ? (
            <b>
              <Money value={value} />
            </b>
          ) : (
            value
          )}
        </span>
      ),
    },
    {
      Header: <T id="PromotionPage.lots.lots" />,
      accessor: 'lots',
      Cell: ({ value: lots = [] }) => (
        <div className="lot-chips">
          {lots.map(lot => (
            <LotChip lot={lot} key={lot._id} />
          ))}
        </div>
      ),
      disableSortBy: true,
    },
    {
      Header: <T id="PromotionPage.lots.loans" />,
      accessor: 'loanCount',
      Cell: ({ value: loanCount }) => (
        <span className="loan-count">{loanCount}</span>
      ),
    },
    {
      Header: <T id="PromotionPage.lots.attributedTo" />,
      accessor: 'attributedTo',
      Cell: ({ value: attributedTo }) => {
        const { _id: loanId } = attributedTo || {};
        let invitedBy;
        if (loanId) {
          const { $metadata = {} } = loans.find(({ _id }) => _id === loanId);
          invitedBy = $metadata.invitedBy;
        }

        return attributedTo ? (
          <PromotionCustomer
            user={attributedTo.user}
            invitedBy={invitedBy}
            promotionUsers={promotionUsers}
          />
        ) : null;
      },
    },
  ];
};
const ProPromotionLotsTableContainer = withProps(({ promotion }) => {
  const { _id: promotionId, promotionLotGroups = [] } = promotion;
  const [status, setStatus] = useState();
  const [promotionLotGroupId, setPromotionLotGroupId] = useState();

  const queryConfig = {
    query: proPromotionLots,
    params: {
      promotionId,
      status,
      promotionLotGroupId,
    },
  };

  const initialHiddenColumns =
    promotionLotGroups.length === 0 ? ['promotionLotGroupIds'] : [];

  const queryDeps = [status, promotionLotGroupId];
  const columns = getProColumns(promotion);

  return {
    status,
    setStatus,
    promotionLotGroupId,
    setPromotionLotGroupId,
    queryConfig,
    queryDeps,
    columns,
    initialHiddenColumns,
  };
});

export default ProPromotionLotsTableContainer;
