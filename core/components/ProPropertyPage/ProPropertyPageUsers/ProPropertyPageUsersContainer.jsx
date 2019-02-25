import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/pro-light-svg-icons/faCrown';

import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import IconButton from 'core/components/IconButton/IconButton';

import T from 'core/components/Translation';
import { getUserNameAndOrganisation } from 'core/api/promotions/promotionClientHelpers';
import { createRoute } from 'core/utils/routerUtils';
import proPropertyUsers from '../../../api/properties/queries/proPropertyUsers';
import { withSmartQuery } from '../../../api/containerToolkit';

const columnOptions = [
  { id: 'name' },
  { id: 'email' },
  { id: 'permissions' },
  { id: 'actions' },
].map(({ id }) => ({
  id,
  label: <T id={`AdminPromotionPage.PromotionUsers.${id}`} />,
}));

const makeMapProPropertyUser = ({ propertyId, history }) => (user) => {
  const { _id, email, $metadata = {}, isOwner, name } = user;

  const { permissions = {} } = $metadata;
  return {
    id: _id,
    columns: [
      {
        raw: name,
        label: isOwner ? (
          <div className="property-owner">
            <FontAwesomeIcon icon={faCrown} className="icon" />
            <p>{getUserNameAndOrganisation({ user })}</p>
          </div>
        ) : (
          getUserNameAndOrganisation({ user })
        ),
      },
      email,
      {
        raw: permissions,
        label: (
          <div onClick={event => event.stopPropagation()}>
            {/* <PromotionUserPermissionsModifier
              user={user}
              promotionId={promotionId}
            /> */}
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
            })} du bien immobilier ?`);
            // if (confirm) {
            //   return removeProFromPromotion.run({ promotionId, userId: _id });
            // }
            return Promise.resolve();
          }}
          type="close"
          tooltip="Enlever du bien immobilier"
        />
      </div>,
    ],
    handleClick: () =>
      history.push(createRoute('/users/:userId', { userId: _id })),
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
  withProps(({ property: { _id: propertyId }, proUsers, history }) => ({
    columnOptions,
    rows: proUsers
      ? proUsers.map(makeMapProPropertyUser({ propertyId, history }))
      : [],
  })),
);
