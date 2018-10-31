// @flow
import React from 'react';

import SimpleSchema from 'simpl-schema';
import { inviteUserToPromotion } from '../../../../api/promotions/methodDefinitions';
import { PROMOTION_STATUS } from '../../../../api/constants';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';

type CustomerAdderProps = {
  promotionId: String,
  promotionStatus: String,
};

const CustomerAdderUserSchema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
});

const onSuccessMessage = ({ email }) => `Invitation envoyée à ${email}`;

const CustomerAdder = ({
  promotionId,
  promotionStatus,
}: CustomerAdderProps) => {
  const disabled = promotionStatus !== PROMOTION_STATUS.OPEN;
  return (
    <AutoFormDialog
      buttonProps={{
        raised: true,
        primary: true,
        label: <T id="PromotionPage.addCustomer" />,
        disabled,
        tooltip:
          disabled
          && 'Vous ne pouvez ajouter des clients que lorsque la promotion est en cours, contactez e-Potek pour changer le statut de la promotion',
      }}
      schema={CustomerAdderUserSchema}
      onSubmit={user => inviteUserToPromotion.run({ user, promotionId })}
      title="Inviter un client"
      description="Invitez un utilisateur à la promotion avec son addresse email. Il recevra un mail avec un lien pour se connecter à e-Potek."
      onSuccessMessage={onSuccessMessage}
    />
  );
};

export default CustomerAdder;
