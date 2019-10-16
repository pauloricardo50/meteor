import React from 'react';
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

const columnOptions = [
  { id: 'name' },
  { id: 'email' },
  { id: 'roles' },
  { id: 'permissions' },
  { id: 'actions' },
].map(({ id }) => ({
  id,
  label: <T id={`AdminPromotionPage.PromotionUsers.${id}`} />,
}));

const makeMapPromotionUser = ({ promotionId }) => (user) => {
  const {
    _id: userId,
    name,
    email,
    $metadata: { permissions, roles = [] },
  } = user;
  return {
    id: userId,
    columns: [
      {
        raw: name,
        label: (
          <CollectionIconLink
            relatedDoc={{ ...user, collection: USERS_COLLECTION }}
          />
        ),
      },
      email,
      {
        raw: roles,
        label: (
          <PromotionUserRolesModifier
            userId={userId}
            promotionId={promotionId}
            roles={roles}
          />
        ),
      },
      {
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
      </div>,
    ],
  };
};

export default withProps(({ promotion: { _id: promotionId, users } }) => ({
  columnOptions,
  rows: users ? users.map(makeMapPromotionUser({ promotionId })) : [],
}));
