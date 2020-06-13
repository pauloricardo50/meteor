import React from 'react';

import { getUserNameAndOrganisation } from '../../../../api/helpers';
import { removeProFromPromotion } from '../../../../api/promotions/methodDefinitions';
import Table from '../../../DataTable/Table';
import IconButton from '../../../IconButton';
import ImpersonateLink from '../../../Impersonate/ImpersonateLink';
import ProCustomer from '../../../ProCustomer';
import T from '../../../Translation';
import { usePromotion } from '../PromotionPageContext';
import PromotionUserPermissionsModifier from './PromotionUserPermissionsModifier';
import PromotionUserRoles from './PromotionUserRoles';

const PromotionUsers = () => {
  const {
    promotion: { _id: promotionId, users },
    permissions: { canManageProUsers },
  } = usePromotion();

  return (
    <div className="animated fadeIn mt-16">
      <div className="card1 card-top promotion-users-table">
        <div
          className="flex center-align"
          style={{ justifyContent: 'space-between' }}
        >
          <h2>
            <T id="PromotionPage.PromotionUsers" />
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

                  <IconButton
                    onClick={() => {
                      const confirm = window.confirm(
                        `Supprimer ${getUserNameAndOrganisation({
                          user,
                        })} de la promotion ?`,
                      );
                      if (confirm) {
                        return removeProFromPromotion.run({
                          promotionId,
                          userId: user._id,
                        });
                      }
                      return Promise.resolve();
                    }}
                    type="close"
                    tooltip="Enlever de la promotion"
                    size="small"
                  />
                </div>
              ),
            },
          ].filter(x => x)}
          data={users}
        />
      </div>
    </div>
  );
};

export default PromotionUsers;
