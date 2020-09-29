import React, { useCallback, useState } from 'react';

import { getUserNameAndOrganisation } from '../../../../api/helpers';
import { proPromotionOptions } from '../../../../api/promotionOptions/queries';
import { removeProFromPromotion } from '../../../../api/promotions/methodDefinitions';
import useMeteorData from '../../../../hooks/useMeteorData';
import ConfirmMethod from '../../../ConfirmMethod';
import Table from '../../../DataTable/Table';
import IconButton from '../../../IconButton';
import ImpersonateLink from '../../../Impersonate/ImpersonateLink';
import ProCustomer from '../../../ProCustomer';
import T from '../../../Translation';
import { usePromotion } from '../PromotionPageContext';
import PromotionBrokerStats from './PromotionBrokerStats';
import PromotionUserPermissionsModifier from './PromotionUserPermissionsModifier';
import PromotionUserRoles from './PromotionUserRoles';

const PromotionUsers = () => {
  const {
    promotion: { _id: promotionId, name: promotionName, users },
    permissions: { canManageProUsers },
  } = usePromotion();

  const [invitedBy, setInvitedBy] = useState();

  const { data: promotionOptions, loading } = useMeteorData(
    {
      query: invitedBy && proPromotionOptions,
      params: {
        promotionId,
        invitedBy,
        $body: {
          loanCache: { _id: 1 },
          invitedBy: 1,
          status: 1,
        },
      },
      refetchOnMethodCall: false,
    },
    [invitedBy],
  );

  const onStateChange = useCallback(({ page }) => {
    const userIds = page?.map(({ original }) => original?._id);
    const shouldUpdateInvitedBy =
      userIds?.length && invitedBy?.$in?.join('') !== userIds.join('');

    if (shouldUpdateInvitedBy) {
      setInvitedBy({ $in: userIds });
    }
  });

  return (
    <div className="animated fadeIn mt-16">
      <div className="card1 card-top promotion-users-table">
        <div
          className="flex center-align"
          style={{ justifyContent: 'space-between' }}
        >
          <h2>
            <T defaultMessage="Pros" />
          </h2>
        </div>

        <Table
          columns={[
            {
              accessor: 'name',
              Header: <T id="PromotionPage.PromotionUsers.name" />,
              Cell: ({ row: { original: user } }) => (
                <ProCustomer
                  user={{ ...user, name: getUserNameAndOrganisation({ user }) }}
                  iconStyle={{ maxWidth: 'unset' }}
                />
              ),
            },
            {
              accessor: 'brokerStats',
              disableSortBy: true,
              Header: <T id="PromotionPage.PromotionUsers.stats" />,
              Cell: ({
                row: {
                  original: { _id: userId },
                },
              }) => (
                <PromotionBrokerStats
                  promotionOptions={promotionOptions}
                  userId={userId}
                  loading={loading}
                />
              ),
            },
            {
              accessor: 'roles.$metadata.roles.0',
              Header: <T id="PromotionPage.PromotionUsers.roles" />,
              Cell: ({ row: { original: user } }) => (
                <PromotionUserRoles user={user} />
              ),
            },
            {
              accessor: 'permissions',
              Header: <T id="PromotionPage.PromotionUsers.permissions" />,
              disableSortBy: true,
              Cell: ({ row: { original: user } }) => (
                <PromotionUserPermissionsModifier
                  user={user}
                  promotionId={promotionId}
                  canModify={canManageProUsers}
                />
              ),
            },
            canManageProUsers && {
              accessor: 'actions',
              Header: <T id="PromotionPage.PromotionUsers.actions" />,
              disableSortBy: true,
              Cell: ({ row: { original: user } }) => (
                <div onClick={event => event.stopPropagation()} key={user._id}>
                  <ImpersonateLink
                    user={user}
                    key="impersonate"
                    className="impersonate-link mr-4"
                    size="small"
                  />
                  <ConfirmMethod
                    TriggerComponent={IconButton}
                    buttonProps={{
                      type: 'close',
                      size: 'small',
                      tooltip: 'Enlever de la promotion',
                    }}
                    method={() =>
                      removeProFromPromotion.run({
                        promotionId,
                        userId: user._id,
                      })
                    }
                    description={`Enlever ${user.name} de la promotion ${promotionName}?`}
                  />
                </div>
              ),
            },
          ].filter(x => x)}
          data={users}
          onStateChange={onStateChange}
        />
      </div>
    </div>
  );
};

export default PromotionUsers;
