import React, { useState } from 'react';
import omit from 'lodash/omit';

import DataTable from 'core/components/DataTable';

import {
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_OPTION_STATUS,
} from '../../../../api/promotionOptions/promotionOptionConstants';
import { proPromotionOptions } from '../../../../api/promotionOptions/queries';
import { PROMOTION_USERS_ROLES } from '../../../../api/promotions/promotionConstants';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import Select from '../../../Select';
import MongoSelect from '../../../Select/MongoSelect';
import StatusLabel from '../../../StatusLabel';
import T, { IntlDate } from '../../../Translation';
import PromotionReservationProgress from '../../PromotionReservationProgress2';
import PromotionCustomer from '../PromotionCustomer';
import PromotionLotGroupChip from '../PromotionLotsTable/PromotionLotGroupChip';
import PromotionReservationDetail from '../PromotionReservations/PromotionReservationDetail/PromotionReservationDetail';

const getModalProps = promotionOption => {
  const { promotionLots, loan } = promotionOption;
  const [promotionLot] = promotionLots;
  return {
    title: (
      <T
        id="PromotionReservationsTable.modalTitle"
        values={{
          lotName: <b>{promotionLot.name}</b>,
          customerName: <b>{loan.user.name}</b>,
        }}
      />
    ),
    children: (
      <PromotionReservationDetail
        promotionOption={promotionOption}
        loan={loan}
      />
    ),
  };
};

const PromotionOptionsTable = ({ promotion }) => {
  const currentUser = useCurrentUser();
  const {
    _id: promotionId,
    users: promotionUsers,
    promotionLotGroups = [],
  } = promotion;
  const [statusFilter, setStatusFilter] = useState({
    $in: [
      PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
      PROMOTION_OPTION_STATUS.RESERVED,
      PROMOTION_OPTION_STATUS.SOLD,
    ],
  });
  const [invitedByFilter, setInvitedByFilter] = useState(() => {
    // Only initialise this filter for brokers
    const userIsInPromotion = promotionUsers.find(
      ({ _id, $metadata }) =>
        _id === currentUser._id &&
        $metadata.roles.includes(PROMOTION_USERS_ROLES.BROKER),
    );
    return userIsInPromotion ? currentUser._id : null;
  });

  const [promotionLotGroupIdFilter, setPromotionLotGroupIdFilter] = useState();

  return (
    <div className="card1 card-top">
      <div className="flex center-align">
        <h3 className="text-center mr-8">Réservations</h3>
        <MongoSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={omit(
            PROMOTION_OPTION_STATUS,
            PROMOTION_OPTION_STATUS.INTERESTED,
          )}
          id="status"
          label="Statut"
          className="mr-8"
        />
        {!!promotionLotGroups.length && (
          <MongoSelect
            value={promotionLotGroupIdFilter}
            onChange={setPromotionLotGroupIdFilter}
            options={promotionLotGroups}
            id="promotionLotGroupIds"
            label="Groupe de lots"
            className="mr-8"
          />
        )}
        <Select
          value={invitedByFilter}
          onChange={setInvitedByFilter}
          options={[
            { id: null, label: <T id="general.all" /> },
            ...promotionUsers.map(({ _id, name, organisations }) => ({
              id: _id,
              label: name,
              organisations,
            })),
          ]}
          label={<T id="Forms.invitedBy" />}
          displayEmpty
          notched
          InputLabelProps={{ shrink: true }}
          grouping={{ groupBy: 'organisations.0.name' }}
        />
      </div>

      <DataTable
        queryConfig={{
          query: proPromotionOptions,
          params: {
            status: {
              ...statusFilter,
              $ne: PROMOTION_OPTION_STATUS.INTERESTED,
            },
            promotionId,
            invitedBy: invitedByFilter,
            promotionLotGroupId: promotionLotGroupIdFilter,
            $body: {
              bank: 1,
              createdAt: 1,
              promotionLots: { name: 1, promotionLotGroupIds: 1 },
              fullVerification: 1,
              loanCache: 1,
              loan: {
                user: { name: 1, phoneNumbers: 1, email: 1 },
                promotions: { _id: 1 },
                proNote: 1,
              },
              priorityOrder: 1,
              reservationAgreement: 1,
              reservationDeposit: 1,
              simpleVerification: 1,
              status: 1,
            },
          },
        }}
        queryDeps={[statusFilter, invitedByFilter, promotionLotGroupIdFilter]}
        columns={[
          {
            Header: <T id="PromotionOptionsTable.lotName" />,
            accessor: 'promotionLots.0.name',
            disableSortBy: true,
          },
          {
            Header: <T id="PromotionOptionsTable.promotionLotGroups" />,
            accessor: 'promotionLots.0.promotionLotGroupIds',
            disableSortBy: true,
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
          },
          {
            Header: <T id="PromotionOptionsTable.status" />,
            accessor: 'status',
            Cell: ({ value }) => (
              <StatusLabel
                status={value}
                collection={PROMOTION_OPTIONS_COLLECTION}
              />
            ),
          },
          {
            Header: <T id="PromotionOptionsTable.buyer" />,
            accessor: 'loan.user.name',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
              const {
                loan: { user, promotions },
              } = original;
              const [
                {
                  $metadata: { invitedBy },
                },
              ] = promotions;
              return (
                <PromotionCustomer
                  user={user}
                  invitedBy={invitedBy}
                  promotionUsers={promotionUsers}
                />
              );
            },
          },
          {
            Header: <T id="PromotionOptionsTable.createdAt" />,
            accessor: 'createdAt',
            Cell: ({ value }) => <IntlDate value={value} type="relative" />,
          },
          {
            Header: <T id="PromotionOptionsTable.progress" />,
            accessor: '_id',
            disableSortBy: true,
            Cell: ({ row: { original: promotionOption } }) => (
              <PromotionReservationProgress
                promotionOption={promotionOption}
                className="mr-8 flex"
                StepperProps={{ style: { padding: 0 } }}
              />
            ),
          },
        ]}
        initialPageSize={10}
        modalType="dialog"
        getModalProps={getModalProps}
        initialHiddenColumns={
          promotionLotGroups.length === 0
            ? ['promotionLots.0.promotionLotGroupIds']
            : []
        }
      />
    </div>
  );
};

export default PromotionOptionsTable;
