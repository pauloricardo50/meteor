import React, { useState } from 'react';
import { withProps } from 'recompose';
import { useHistory } from 'react-router-dom';

import SimpleSchema from 'simpl-schema';
import useSearchParams from 'core/hooks/useSearchParams';
import { createRoute } from 'core/utils/routerUtils';
import { proInviteUser } from '../../../api/methods';
import { PROMOTION_STATUS } from '../../../api/constants';
import T from '../../Translation';
import Icon from '../../Icon';
import { AutoFormDialog } from '../../AutoForm2';

SimpleSchema.setDefaultMessages({
  messages: {
    fr: { emptyPromotionLotIds: 'Veuillez préselectionner au moins un lot' },
  },
});

export const CustomerAdderUserSchema = ({
  promotion: { users = [], promotionLots = [] },
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
        transform: userId => {
          const { name, organisations = [] } = users.find(
            ({ _id }) => _id === userId,
          );
          // Display user's first organisation name
          const organisationName =
            !!organisations.length && organisations[0].name;
          return organisationName ? `${name} (${organisationName})` : name;
        },
        displayEmpty: false,
        placeholder: '',
      },
    },
    promotionLotIds: {
      type: Array,
      defaultValue: [],
      uniforms: {
        placeholder: null,
      },
      optional: false,
      // We don't use minCount: 1 because it inserts an undefined promotionLotId to the array by default
      custom() {
        if (this.value.length === 0) {
          return 'emptyPromotionLotIds';
        }
      },
    },
    'promotionLotIds.$': {
      type: String,
      allowedValues: promotionLots.map(({ _id }) => _id),
      uniforms: {
        transform: promotionLotId => {
          const { name } =
            promotionLots.find(({ _id }) => _id === promotionLotId) || {};
          return name;
        },
      },
    },
    showAllLots: {
      type: Boolean,
      defaultValue: true,
      condition: ({ promotionLotIds = [] }) => promotionLotIds.length > 0,
      optional: true,
    },
  });

const onSuccessMessage = ({ email }) => `Invitation envoyée à ${email}`;

const CustomerAdder = ({
  promotion,
  model,
  openOnMount = false,
  resetForm,
}) => {
  const { _id: promotionId, status } = promotion;
  const disabled = status !== PROMOTION_STATUS.OPEN;
  const history = useHistory();

  return (
    <AutoFormDialog
      buttonProps={{
        raised: true,
        secondary: true,
        label: <T id="PromotionPage.addCustomer" />,
        disabled,
        icon: <Icon type="personAdd"> </Icon>,
        tooltip: disabled
          ? 'Vous ne pouvez ajouter des clients que lorsque la promotion est en cours, contactez e-Potek pour changer le statut de la promotion'
          : undefined,
      }}
      schema={CustomerAdderUserSchema({ promotion })}
      onSubmit={user =>
        proInviteUser.run({ user, promotionIds: [promotionId] }).then(() => {
          resetForm();
          history.push(
            createRoute('/promotions/:promotionId/customers', {
              promotionId,
            }),
          );
        })
      }
      title="Inviter un client"
      description="Invitez un client à la promotion avec son addresse email. Il recevra un mail avec un lien pour se connecter à e-Potek. Vous recevrez un mail de confirmation."
      onSuccessMessage={onSuccessMessage}
      model={model}
      openOnMount={openOnMount}
    />
  );
};

export default withProps(() => {
  const initialSearchParams = useSearchParams();
  // Don't reinitialize searchParams after initialization, or the form breaks
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  return {
    model: searchParams,
    openOnMount: !!Object.keys(searchParams).filter(key =>
      ['email', 'firstName', 'lastName', 'phoneNumber'].includes(key),
    ).length,
    resetForm: () => setSearchParams({}),
  };
})(CustomerAdder);
