// @flow
import React from 'react';

import SimpleSchema from 'simpl-schema';
import { proInviteUser } from 'core/api/users/';
import { PROMOTION_STATUS } from '../../../../api/constants';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';

type CustomerAdderProps = {
  promotion: Object,
  promotionStatus: String,
};

export const CustomerAdderUserSchema = ({
  promotion: { users = [], promotionLots },
}) =>
  new SimpleSchema({
    email: String,
    firstName: String,
    lastName: String,
    phoneNumber: { type: String, optional: true },
    invitedBy: {
      type: String,
      optional: false,
      defaultValue: null,
      allowedValues: users.map(({ _id }) => _id),
      uniforms: {
        transform: (userId) => {
          const { name, organisations = [] } = users.find(({ _id }) => _id === userId);
          // Display user's first organisation name
          const organisationName = !!organisations.length && organisations[0].name;
          return organisationName ? `${name} (${organisationName})` : name;
        },
        displayEmpty: false,
        placeholder: '',
      },
    },
    promotionLots: {
      type: Array,
      defaultValue: [],
      uniforms: {
        placeholder: null,
      },
      optional: true,
    },
    'promotionLots.$': {
      type: String,
      allowedValues: promotionLots.map(({ _id }) => _id),
      uniforms: {
        transform: (promotionLotId) => {
          const { name } = promotionLots.find(({ _id }) => _id === promotionLotId);
          return name;
        },
      },
    },
    showAllLots: {
      type: Boolean,
      defaultValue: true,
      condition: ({ promotionLots: chosenPromotionLots = [] }) =>
        chosenPromotionLots.length > 0,
      optional: true,
    },
  });

const onSuccessMessage = ({ email }) => `Invitation envoyée à ${email}`;

const CustomerAdder = ({ promotion, promotionStatus }: CustomerAdderProps) => {
  const { _id: promotionId } = promotion;
  const disabled = promotionStatus !== PROMOTION_STATUS.OPEN;
  return (
    <AutoFormDialog
      buttonProps={{
        raised: true,
        primary: true,
        label: <T id="PromotionPage.addCustomer" />,
        disabled,
        tooltip: disabled
          ? 'Vous ne pouvez ajouter des clients que lorsque la promotion est en cours, contactez e-Potek pour changer le statut de la promotion'
          : undefined,
      }}
      schema={CustomerAdderUserSchema({ promotion })}
      onSubmit={user =>
        proInviteUser.run({ user, promotionIds: [promotionId] })
      }
      title="Inviter un client"
      description="Invitez un client à la promotion avec son addresse email. Il recevra un mail avec un lien pour se connecter à e-Potek."
      onSuccessMessage={onSuccessMessage}
    />
  );
};

export default CustomerAdder;
