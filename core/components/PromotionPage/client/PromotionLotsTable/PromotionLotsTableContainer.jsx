import React, { useMemo, useState } from 'react';
import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from '../../../../api/containerToolkit';
import {
  appPromotionLots,
  proPromotionLots,
} from '../../../../api/promotionLots/queries';
import { PROMOTION_STATUS } from '../../../../api/promotions/promotionConstants';
import { useStaticMeteorData } from '../../../../hooks/useMeteorData';
import { withLoading } from '../../../Loading';
import StatusLabel from '../../../StatusLabel';
import T, { Money } from '../../../Translation';
import PromotionCustomer from '../PromotionCustomer';
import { getPromotionLotValue } from '../PromotionManagement/helpers';
import LotChip from './LotChip';
import PromotionLotGroupChip from './PromotionLotGroupChip';
import PromotionLotSelector from './PromotionLotSelector';

const proColumnOptions = [
  { id: 'name' },
  { id: 'group' },
  { id: 'status' },
  {
    id: 'totalValue',
    style: { whiteSpace: 'nowrap' },
    align: 'right',
    format: value => (
      <b>
        <Money value={value} />
      </b>
    ),
  },
  { id: 'lots' },
  { id: 'loans' },
  { id: 'attributedTo' },
].map(column => ({
  ...column,
  label: <T id={`PromotionPage.lots.${column.id}`} />,
}));

const appColumnOptions = ({ promotionStatus }) =>
  [
    { id: 'name' },
    { id: 'status' },
    {
      id: 'totalValue',
      style: { whiteSpace: 'nowrap' },
      align: 'right',
      format: value =>
        typeof value === 'number' ? (
          <b>
            <Money value={value} />
          </b>
        ) : (
          value
        ),
    },
    { id: 'lots' },
    promotionStatus === PROMOTION_STATUS.OPEN && {
      id: 'interested',
      padding: 'checkbox',
    },
  ]
    .filter(x => x)
    .map(column => ({
      ...column,
      label: <T id={`PromotionPage.lots.${column.id}`} />,
    }));

const makeMapProPromotionLot = ({ promotion }) => promotionLot => {
  const {
    _collection,
    _id: promotionLotId,
    name,
    status,
    lots,
    promotionOptions,
    value,
    attributedTo,
    promotionLotGroupIds = [],
  } = promotionLot;

  let invitedBy;
  const { _id: loanId } = attributedTo || {};
  const {
    loans = [],
    users: promotionUsers = [],
    promotionLotGroups = [],
  } = promotion;

  if (loanId) {
    const { $metadata = {} } = loans.find(({ _id }) => _id === loanId);
    invitedBy = $metadata.invitedBy;
  }

  return {
    id: promotionLotId,
    promotionLot,
    columns: [
      name,
      {
        raw: promotionLotGroupIds.length,
        label: (
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
      },
      {
        raw: status,
        label: (
          <StatusLabel status={status} collection={_collection} key="status" />
        ),
      },
      value,
      {
        raw: lots && lots.length,
        label: (
          <div className="lot-chips">
            {lots && lots.map(lot => <LotChip lot={lot} key={lot._id} />)}
          </div>
        ),
      },
      promotionOptions.length,
      attributedTo && (
        <PromotionCustomer
          user={attributedTo.user}
          invitedBy={invitedBy}
          promotionUsers={promotionUsers}
        />
      ),
    ],
  };
};

const makeMapAppPromotionLot = ({
  loan: { _id: loanId, promotionOptions },
  promotionStatus,
  promotionId,
}) => promotionLot => {
  const {
    _collection,
    _id: promotionLotId,
    name,
    status,
    reducedStatus,
    lots,
  } = promotionLot;

  return {
    id: promotionLotId,
    promotionLot,
    columns: [
      name,
      {
        raw: status,
        label: <StatusLabel status={reducedStatus} collection={_collection} />,
      },
      getPromotionLotValue(promotionLot),
      {
        raw: lots && lots.length,
        label: (
          <div className="lot-chips">
            {lots && lots.map(lot => <LotChip lot={lot} key={lot._id} />)}
          </div>
        ),
      },
      promotionStatus === PROMOTION_STATUS.OPEN && (
        <div key="PromotionLotSelector" onClick={e => e.stopPropagation()}>
          <PromotionLotSelector
            promotionLotId={promotionLotId}
            promotionOptions={promotionOptions}
            loanId={loanId}
            promotionId={promotionId}
          />
        </div>
      ),
    ].filter(x => x !== false),
  };
};

const withStatusFilter = withState('status', 'setStatus', undefined);

export const ProPromotionLotsTableContainer = compose(
  withStatusFilter,
  withProps(() => {
    const [promotionLotGroupId, setPromotionLotGroupId] = useState();
    return { promotionLotGroupId, setPromotionLotGroupId };
  }),
  withSmartQuery({
    query: proPromotionLots,
    params: ({
      promotion: { _id: promotionId },
      status,
      promotionLotGroupId,
    }) => ({
      promotionId,
      status,
      promotionLotGroupId,
    }),
    dataName: 'promotionLots',
    deps: ({ status, promotionLotGroupId }) => [status, promotionLotGroupId],
  }),
  withProps(({ promotionLots, promotion }) => ({
    rows: promotionLots.map(makeMapProPromotionLot({ promotion })),
    columnOptions: proColumnOptions,
  })),
);

export const AppPromotionLotsTableContainer = compose(
  withProps(
    ({
      promotion: { _id: promotionId },
      status,
      loan: { promotions = [], promotionOptions = [] } = {},
    }) => {
      const [promotion] = promotions || {};
      const { $metadata: { showAllLots = false } = {} } = promotion;
      const promotionLotIds = useMemo(
        () =>
          promotionOptions.reduce((ids, promotionOption) => {
            const { promotionLots = [] } = promotionOption;
            return [...ids, ...promotionLots.map(({ _id }) => _id)];
          }, []),
        { promotionOptions },
      );
      const { data: promotionLots, loading } = useStaticMeteorData(
        {
          query: appPromotionLots,
          params: {
            promotionId,
            status,
            showAllLots,
            promotionLotIds,
          },
        },
        [status, promotionLotIds, showAllLots],
      );

      return { promotionLots, loading };
    },
  ),
  withLoading(),
  withProps(
    ({
      promotionLots,
      promotion: { status: promotionStatus, _id: promotionId },
      loan,
    }) => ({
      rows: promotionLots.map(
        makeMapAppPromotionLot({
          loan,
          promotionStatus,
          promotionId,
        }),
      ),
      columnOptions: appColumnOptions({ promotionStatus }),
    }),
  ),
);
