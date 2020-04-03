import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from '../../../api/containerToolkit';
import { getUserNameAndOrganisation } from '../../../api/helpers';
import { removeProFromProperty } from '../../../api/properties/methodDefinitions';
import { proPropertyUsers } from '../../../api/properties/queries';
import { createRoute } from '../../../utils/routerUtils';
import IconButton from '../../IconButton/IconButton';
import ImpersonateLink from '../../Impersonate/ImpersonateLink';
import ProPropertyUserPermissionsModifier from '../../ProPropertyUserPermissions/ProPropertyUserPermissionsModifier';
import T from '../../Translation';

const columnOptions = ({ permissions }) => {
  const { isAdmin, canManagePermissions } = permissions;

  return [
    { id: 'name' },
    { id: 'email' },
    canManagePermissions ? { id: 'permissions' } : null,
    isAdmin ? { id: 'actions' } : null,
  ]
    .filter(x => x)
    .map(({ id }) => ({
      id,
      label: <T id={`ProPropertyPage.ProUsers.${id}`} />,
    }));
};

const makeMapProPropertyUser = ({
  propertyId,
  history,
  permissions,
}) => user => {
  const { _id, email, name } = user;
  const { isAdmin, canManagePermissions } = permissions;

  return {
    id: _id,
    columns: [
      {
        raw: name,
        label: getUserNameAndOrganisation({ user }),
      },
      email,
      canManagePermissions ? (
        <div
          onClick={event => event.stopPropagation()}
          key={`permissions${_id}`}
        >
          <ProPropertyUserPermissionsModifier
            user={user}
            propertyId={propertyId}
          />
        </div>
      ) : null,
      isAdmin ? (
        <div onClick={event => event.stopPropagation()} key={_id}>
          <ImpersonateLink
            user={user}
            key="impersonate"
            className="impersonate-link"
          />
          <IconButton
            onClick={() => {
              const confirm = window.confirm(
                `Supprimer ${getUserNameAndOrganisation({
                  user,
                })} du bien immobilier ?`,
              );
              if (confirm) {
                return removeProFromProperty.run({
                  propertyId,
                  proUserId: _id,
                });
              }
              return Promise.resolve();
            }}
            type="close"
            tooltip={<T id="ProPropertyPage.usersTable.removeUser.tooltip" />}
          />
        </div>
      ) : null,
    ].filter(x => x),
    handleClick: isAdmin
      ? () => history.push(createRoute('/users/:userId', { userId: _id }))
      : () => null,
  };
};

export default compose(
  withRouter,
  withSmartQuery({
    query: proPropertyUsers,
    params: ({ property: { _id: propertyId } }) => ({ propertyId }),
    queryOptions: { reactive: false },
    dataName: 'proUsers',
  }),
  withProps(
    ({ property: { _id: propertyId }, proUsers, history, permissions }) => ({
      columnOptions: columnOptions({ permissions }),
      rows: proUsers
        ? proUsers.map(
            makeMapProPropertyUser({ propertyId, history, permissions }),
          )
        : [],
    }),
  ),
);
