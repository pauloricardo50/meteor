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
  const { promotionLotGroups = [], users: promotionUsers = [] } = promotion;

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
      accessor: 'attributedToUser',
      Cell: ({ value: attributedToUser }) => {
        if (!attributedToUser) {
          return null;
        }

        const {
          loan: { userCache },
          loanCache,
        } = attributedToUser;
        const [{ invitedBy }] = loanCache[0].promotionLinks;

        return (
          <PromotionCustomer
            user={userCache}
            invitedBy={invitedBy}
            promotionUsers={promotionUsers}
          />
        );
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
      $body: {
        name: 1,
        promotionLotGroupIds: 1,
        status: 1,
        value: 1,
        lots: { type: 1, name: 1, value: 1 },
        loanCount: 1,
        attributedToUser: 1,
      },
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
