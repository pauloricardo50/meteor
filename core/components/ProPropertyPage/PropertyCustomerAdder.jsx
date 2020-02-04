//      
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { compose, withState } from 'recompose';

import { proInviteUser } from 'core/api/methods';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proReferredByUsers } from 'core/api/users/queries';
import DropdownMenu from 'core/components/DropdownMenu';
import { AutoFormDialog } from '../AutoForm2';
import T from '../Translation';

                                     

const customerSchema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, optional: true },
});

const inviteReferredUser = ({ referredUsers, setModel, loans }) => {
  const invitedUserIds = loans.map(({ user: { _id } = {} }) => _id);
  const options = referredUsers
    .filter(({ _id }) => !invitedUserIds.some(userId => userId === _id))
    .map(user => {
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
        <h4>
          <T id="PropertyCustomerAdder.referredUsers" />
        </h4>
        <DropdownMenu
          iconType="personAdd"
          options={options}
          tooltip={<T id="PropertyCustomerAdder.referredUsers.tooltip" />}
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
}                            ) => (
  <AutoFormDialog
    schema={customerSchema}
    model={model}
    onSubmit={user =>
      proInviteUser
        .run({ user, propertyIds: [propertyId] })
        .then(() => setModel({}))
    }
    buttonProps={{
      raised: true,
      secondary: true,
      label: <T id="PropertyCustomerAdder.title" />,
    }}
    title={<T id="PropertyCustomerAdder.title" />}
    description={
      <p className="description">
        <T id="PropertyCustomerAdder.description" />
      </p>
    }
  >
    {() => inviteReferredUser({ referredUsers, setModel, loans })}
  </AutoFormDialog>
);

export default compose(
  withSmartQuery({
    query: proReferredByUsers,
    params: { ownReferredUsers: true },
    queryOptions: { reactive: false },
    dataName: 'referredUsers',
  }),
  withState('model', 'setModel', {}),
)(PropertyCustomerAdder);
