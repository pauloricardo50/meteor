// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { compose, withState } from 'recompose';

import { inviteUserToProperty } from 'core/api/methods';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proReferredByUsers from 'core/api/users/queries/proReferredByUsers';
import DropdownMenu from 'core/components/DropdownMenu';
import { AutoFormDialog } from '../AutoForm2';

type PropertyCustomerAdderProps = {};

const customerSchema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, optional: true },
});

const inviteReferredUser = ({ referredUsers, setModel, loans }) => {
  const invitedUserIds = loans.map(({ user: { _id } }) => _id);
  const options = referredUsers
    .filter(({ _id }) => !invitedUserIds.some(userId => userId === _id))
    .map((user) => {
      const { _id, name } = user;

      return {
        id: _id,
        show: true,
        label: name,
        link: false,
        onClick: () => setModel(user),
      };
    });

  return (
    !!referredUsers.length && (
      <div className="flex flex-row center space-children">
        <h4>Vos clients existants</h4>
        <DropdownMenu
          iconType="personAdd"
          options={options}
          tooltip="Sélectionner un de vos clients existants"
        />
      </div>
    )
  );
};

const PropertyCustomerAdder = ({
  propertyId,
  referredUsers,
  model,
  setModel,
  loans = [],
}: PropertyCustomerAdderProps) => (
  <AutoFormDialog
    schema={customerSchema}
    model={model}
    onSubmit={user =>
      inviteUserToProperty
        .run({ user, propertyIds: [propertyId] })
        .then(() => setModel({}))
    }
    buttonProps={{ raised: true, secondary: true, label: 'Ajouter acheteur' }}
    title="Ajouter acheteur"
  >
    {() => inviteReferredUser({ referredUsers, setModel, loans })}
  </AutoFormDialog>
);

export default compose(
  withSmartQuery({
    query: proReferredByUsers,
    queryOptions: { reactive: false },
    dataName: 'referredUsers',
  }),
  withState('model', 'setModel', {}),
)(PropertyCustomerAdder);
