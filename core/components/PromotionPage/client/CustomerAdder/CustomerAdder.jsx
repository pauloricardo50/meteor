// @flow
import React from 'react';

import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';
import message from '../../../../utils/message';
import LotSchema from '../../../../api/lots/schemas/LotSchema';

type CustomerAdderProps = {};

const CustomerAdder = (props: CustomerAdderProps) => (
  <AutoFormDialog
    buttonProps={{
      raised: true,
      primary: true,
      label: <T id="PromotionPage.addCustomer" />,
    }}
    schema={LotSchema.pick('name')}
    autoFieldProps={{
      labels: {
        name: 'Email',
      },
    }}
    onSubmit={() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 400);
      })
    }
    title="Inviter un client"
    description="Invitez un utilisateur à la promotion avec son addresse email. Il recevra un mail avec un lien pour se connecter à e-Potek."
  />
);

export default CustomerAdder;
