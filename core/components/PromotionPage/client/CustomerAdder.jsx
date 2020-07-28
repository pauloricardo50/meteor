import { Meteor } from 'meteor/meteor';

import React, { useMemo, useState } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { proPromotionLots } from '../../../api/promotionLots/queries';
import { PROMOTION_STATUS } from '../../../api/promotions/promotionConstants';
import { proInviteUser } from '../../../api/users/methodDefinitions';
import { USER_STATUS } from '../../../api/users/userConstants';
import useSearchParams from '../../../hooks/useSearchParams';
import { createRoute } from '../../../utils/routerUtils';
import { AutoFormDialog } from '../../AutoForm2';
import Icon from '../../Icon';
import T from '../../Translation';

SimpleSchema.setDefaultMessages({
  messages: {
    fr: { emptyPromotionLotIds: 'Veuillez préselectionner au moins un lot' },
  },
});

const isAdmin = Meteor.microservice === 'admin';

export const CustomerAdderUserSchema = ({
  promotion: { _id: promotionId, users = [] },
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
      customAllowedValues: {
        query: proPromotionLots,
        params: { promotionId, $body: { name: 1 } },
      },
      uniforms: {
        placeholder: null,
        transform: ({ name }) => name,
      },
      optional: false,
      // We don't use minCount: 1 because it inserts an undefined promotionLotId to the array by default
      custom() {
        if (this.value.length === 0) {
          return 'emptyPromotionLotIds';
        }
      },
    },
    'promotionLotIds.$': String,
    showAllLots: {
      type: Boolean,
      defaultValue: true,
      condition: ({ promotionLotIds = [] }) => promotionLotIds.length > 0,
      optional: true,
    },
    ...(isAdmin
      ? {
          status: {
            type: String,
            allowedValues: Object.values(USER_STATUS).filter(
              status => status !== USER_STATUS.LOST,
            ),
            uniforms: {
              transform: status => (
                <ListItemText
                  primary={
                    status === USER_STATUS.PROSPECT ? 'Prospect' : 'Qualifié'
                  }
                  secondary={
                    status === USER_STATUS.PROSPECT
                      ? "L'utilisateur sera drippé"
                      : "L'utilisateur ne sera pas drippé"
                  }
                />
              ),
            },
          },
        }
      : {}),
    invitationNote: { type: String, optional: true },
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
  const schema = useMemo(() => CustomerAdderUserSchema({ promotion }), []);

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
      schema={schema}
      onSubmit={({ invitationNote, ...user }) =>
        proInviteUser
          .run({
            user: { ...user, status: user.status || USER_STATUS.PROSPECT },
            promotionIds: [promotionId],
            invitationNote,
          })
          .then(() => {
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
