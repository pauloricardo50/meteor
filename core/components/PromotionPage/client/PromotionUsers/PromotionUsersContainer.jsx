import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import { removeProFromPromotion } from '../../../../api/methods';
import { getUserNameAndOrganisation } from '../../../../api/helpers';
import { createRoute } from '../../../../utils/routerUtils';
import ImpersonateLink from '../../../Impersonate/ImpersonateLink';
import IconButton from '../../../IconButton';
import T from '../../../Translation';
import PromotionUserPermissionsModifier from './PromotionUserPermissionsModifier';

const columnOptions = [
  { id: 'name' },
  { id: 'email' },
  { id: 'permissions' },
  { id: 'actions' },
].map(({ id }) => ({
  id,
  label: <T id={`AdminPromotionPage.PromotionUsers.${id}`} />,
}));

const makeMapPromotionUser = ({ promotionId, history }) => (user) => {
  const {
    _id,
    email,
    $metadata: { permissions },
  } = user;
  return {
    id: _id,
    columns: [
      getUserNameAndOrganisation({ user }),
      email,
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
      <div onClick={event => event.stopPropagation()} key={_id}>
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
              return removeProFromPromotion.run({ promotionId, userId: _id });
            }
            return Promise.resolve();
          }}
          type="close"
          tooltip="Enlever de la promotion"
        />
      </div>,
    ],
    handleClick: () =>
      history.push(createRoute('/users/:userId', { userId: _id })),
  };
};

export default compose(
  withRouter,
  withProps(({ promotion: { _id: promotionId, users }, history }) => ({
    columnOptions,
    rows: users
      ? users.map(makeMapPromotionUser({ history, promotionId }))
      : [],
  })),
);
