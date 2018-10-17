// @flow
import React from 'react';
import Table from 'core/components/Table';
import T from 'core/components/Translation';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import { withRouter } from 'react-router-dom';
import { createRoute } from 'core/utils/routerUtils';
import PromotionUserPermissionsModifier from './PromotionUserPermissionsModifier';

type PromotionUsersTableProps = {
  promotion: Object,
};

const columnOptions = [
  { id: 'name' },
  { id: 'email' },
  { id: 'permissions' },
  { id: 'impersonate' },
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
      </div>,
    ],
    handleClick: () =>
      history.push(createRoute('/users/:userId', { userId: _id })),
  };
};

const PromotionUsersTable = ({
  promotion,
  history,
}: PromotionUsersTableProps) => {
  const { users, _id: promotionId } = promotion;
  return (
    <div className="card1 promotion-users-table">
      <h1>Utilisateurs</h1>
      <Table
        rows={users.map(makeMapPromotionUser({ promotionId, history }))}
        columnOptions={columnOptions}
      />
    </div>
  );
};

export default withRouter(PromotionUsersTable);
