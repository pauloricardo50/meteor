// @flow
import React from 'react';

import SimpleSchema from 'simpl-schema';
import { inviteUserToPromotion } from 'core/api/promotions/methodDefinitions';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';
import message from '../../../../utils/message';

type CustomerAdderProps = {
  promotionId: String,
};

const CustomerAdderUserSchema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
});

const CustomerAdder = ({ promotionId }: CustomerAdderProps) => (
  <AutoFormDialog
    buttonProps={{
      raised: true,
      primary: true,
      label: <T id="PromotionPage.addCustomer" />,
    }}
    schema={CustomerAdderUserSchema}
    autoFieldProps={{
      labels: {
        email: 'Email',
        fisrtName: 'Prénom',
        lastName: 'Nom',
        phoneNumber: 'Téléphone',
      },
    }}
    onSubmit={user => inviteUserToPromotion.run({ user, promotionId })}
    title="Inviter un client"
    description="Invitez un utilisateur à la promotion avec son addresse email. Il recevra un mail avec un lien pour se connecter à e-Potek."
  />
);

export default CustomerAdder;
