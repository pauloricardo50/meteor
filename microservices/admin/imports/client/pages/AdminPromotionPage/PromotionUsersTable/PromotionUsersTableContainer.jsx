import React from 'react';
import { withRouter } from 'react-router-dom';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import IconButton from 'core/components/IconButton/IconButton';
import { removeUserFromPromotion } from 'core/api';
import { createRoute } from 'core/utils/routerUtils';
import T from 'core/components/Translation';
import { compose, withProps } from 'recompose';
import PromotionUserPermissionsModifier from '../PromotionUserPermissionsModifier';

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
    name,
    email,
    $metadata: { permissions },
  } = user;
  return {
    id: _id,
    columns: [
      name,
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
          onClick={() =>
            removeUserFromPromotion.run({ promotionId, userId: _id })
          }
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
