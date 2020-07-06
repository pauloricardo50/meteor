import React, { useMemo, useState } from 'react';
import { withProps } from 'recompose';

import { PROMOTION_LOTS_COLLECTION } from '../../../../api/promotionLots/promotionLotConstants';
import { appPromotionLots } from '../../../../api/promotionLots/queries';
import { PROMOTION_STATUS } from '../../../../api/promotions/promotionConstants';
import StatusLabel from '../../../StatusLabel';
import T, { Money } from '../../../Translation';
import { getPromotionLotValue } from '../PromotionManagement/helpers';
import LotChip from './LotChip';
import PromotionLotGroupChip from './PromotionLotGroupChip';
import PromotionLotSelector from './PromotionLotSelector';

const getAppColumns = ({ loan, promotion }) => {
  const { _id: loanId, promotionOptions = [] } = loan;
  const { _id: promotionId, promotionLotGroups = [] } = promotion;

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
      accessor: 'reducedStatus',
      Cell: ({ value: status }) => (
        <StatusLabel status={status} collection={PROMOTION_LOTS_COLLECTION} />
      ),
    },
    {
      Header: <T id="PromotionPage.lots.totalValue" />,
      accessor: 'value',
      disableSortBy: true,
      align: 'right',
      Cell: ({ row: { original: promotionLot } }) => {
        const value = getPromotionLotValue(promotionLot);

        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            {typeof value === 'number' ? (
              <b>
                <Money value={value} />
              </b>
            ) : (
              value
            )}
          </span>
        );
      },
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
      Header: <T id="PromotionPage.lots.interested" />,
      accessor: '_id',
      Cell: ({ row: { original: promotionLot } }) => (
        <div key="PromotionLotSelector" onClick={e => e.stopPropagation()}>
          <PromotionLotSelector
            promotionLotId={promotionLot?._id}
            promotionOptions={promotionOptions}
            loanId={loanId}
            promotionId={promotionId}
          />
        </div>
      ),
    },
  ];
};

const AppPromotionLotsTableContainer = withProps(
  ({
    promotion: {
      _id: promotionId,
      status: promotionStatus,
      promotionLotGroups = [],
    },
    loan = {},
  }) => {
    const { promotions = [], promotionOptions = [] } = loan;

    const [promotion] = promotions || [];
    const { $metadata: { showAllLots = false } = {} } = promotion;
    promotion.promotionLotGroups = promotionLotGroups;
    const promotionLotIds = useMemo(
      () =>
        promotionOptions.reduce((ids, promotionOption) => {
          const { promotionLots = [] } = promotionOption;
          return [...ids, ...promotionLots.map(({ _id }) => _id)];
        }, []),
      { promotionOptions },
    );

    const [promotionLotGroupId, setPromotionLotGroupId] = useState();

    const queryConfig = {
      query: appPromotionLots,
      params: {
        promotionId,
        showAllLots,
        promotionLotIds,
        promotionLotGroupId,
        $body: {
          name: 1,
          promotionLotGroupIds: 1,
          reducedStatus: 1,
          value: 1,
          lots: { type: 1, name: 1, value: 1 },
        },
      },
    };

    const queryDeps = [promotionLotIds, showAllLots, promotionLotGroupId];
    const columns = getAppColumns({ loan, promotion });
    const initialHiddenColumns = [
      promotionStatus !== PROMOTION_STATUS.OPEN && '_id',
      promotionLotGroups.length === 0 && 'promotionLotGroupIds',
    ].filter(x => x);

    return {
      promotionLotGroupId,
      setPromotionLotGroupId,
      queryConfig,
      queryDeps,
      columns,
      initialHiddenColumns,
    };
  },
);

export default AppPromotionLotsTableContainer;
