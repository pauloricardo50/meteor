import React, { useContext } from 'react';
import { withProps } from 'recompose';

import { removeProFromPromotion } from '../../../../api/methods';
import { getUserNameAndOrganisation } from '../../../../api/helpers';
import ImpersonateLink from '../../../Impersonate/ImpersonateLink';
import IconButton from '../../../IconButton';
import T from '../../../Translation';
import PromotionUserPermissionsModifier from './PromotionUserPermissionsModifier';
import PromotionUserRolesModifier from './PromotionUserRolesModifier';
import { USERS_COLLECTION } from '../../../../api/constants';
import { CollectionIconLink } from '../../../IconLink';
import PromotionMetadataContext from '../PromotionMetadata';
import ProCustomer from '../../../ProCustomer';
import TooltipArray from '../../../TooltipArray';

const makeColumnOptions = ({ canManageProUsers }) =>
  [
    { id: 'name' },
    { id: 'roles' },
    canManageProUsers && { id: 'permissions' },
    canManageProUsers && { id: 'actions' },
  ]
    .filter(x => x)
    .map(({ id }) => ({
      id,
      label: <T id={`PromotionPage.PromotionUsers.${id}`} />,
    }));

const makeMapPromotionUser = ({
  promotionId,
  permissions: { canManageProUsers },
}) => (user) => {
  const {
    _id: userId,
    name,
    $metadata: { permissions, roles = [] },
  } = user;
  return {
    id: userId,
    columns: [
      {
        raw: name,
        label: canManageProUsers ? (
          <CollectionIconLink
            relatedDoc={{ ...user, collection: USERS_COLLECTION }}
          />
        ) : (
          <ProCustomer
            user={{ ...user, name: getUserNameAndOrganisation({ user }) }}
          />
        ),
      },
      {
        raw: roles.length && roles[0],
        label: canManageProUsers ? (
          <PromotionUserRolesModifier
            userId={userId}
            promotionId={promotionId}
            roles={roles}
          />
        ) : (
          <TooltipArray
            items={roles.map(role => (
              <>
                <T id={`Forms.roles.${role}`} />
                &nbsp;
              </>
            ))}
            title={<T id="Forms.roles" />}
            displayLimit={2}
          />
        ),
      },
      canManageProUsers && {
        raw: permissions,
        label: (
          <div onClick={event => event.stopPropagation()}>
            <PromotionUserPermissionsModifier
              user={user}
              promotionId={promotionId}
            />
          </div>
        ),
      },
      canManageProUsers && (
        <div onClick={event => event.stopPropagation()} key={userId}>
          <ImpersonateLink
            user={user}
            key="impersonate"
            className="impersonate-link"
          />
          <IconButton
            onClick={() => {
              const confirm = window.confirm(`Supprimer ${getUserNameAndOrganisation({
                user,
              })} de la promotion ?`);
              if (confirm) {
                return removeProFromPromotion.run({ promotionId, userId });
              }
              return Promise.resolve();
            }}
            type="close"
            tooltip="Enlever de la promotion"
          />
        </div>
      ),
    ].filter(x => x),
  };
};

export default withProps(({ promotion: { _id: promotionId, users } }) => {
  const { permissions } = useContext(PromotionMetadataContext);
  return {
    columnOptions: makeColumnOptions(permissions),
    rows: users
      ? users.map(makeMapPromotionUser({ promotionId, permissions }))
      : [],
  };
});
