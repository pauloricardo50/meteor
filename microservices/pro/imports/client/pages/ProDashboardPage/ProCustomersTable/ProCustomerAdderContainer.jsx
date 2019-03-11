import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import {
  isAllowedToInviteCustomersToProProperty,
  isAllowedToInviteCustomersToPromotion,
} from 'core/api/security/clientSecurityHelpers/index';
import { proInviteUser } from 'core/api/methods/index';

const schema = ({ proProperties, promotions }) =>
  new SimpleSchema({
    user: Object,
    'user.email': {
      type: String,
      uniforms: { label: 'Email', placeholder: 'jean.dupont@gmail.com' },
    },
    'user.firstName': {
      type: String,
      uniforms: { label: 'Prénom', placeholder: 'Jean' },
    },
    'user.lastName': {
      type: String,
      uniforms: { label: 'Nom', placeholder: 'Dupont' },
    },
    'user.phoneNumber': {
      type: String,
      optional: true,
      uniforms: { label: 'Téléphone', placeholder: '012 345 67 89' },
    },
    // referOnly: { type: Boolean, defaultValue: false },
    propertyId: {
      optional: true,
      type: String,
      allowedValues: proProperties.map(({ _id }) => _id),
      condition: ({ promotionId }) => proProperties.length && !promotionId,
      uniforms: {
        transform: propertyId =>
          proProperties.find(({ _id }) => _id === propertyId).address1,
        displayEmpty: true,
        placeholder: 'Aucun',
      },
    },
    promotionId: {
      optional: true,
      type: String,
      allowedValues: promotions.map(({ _id }) => _id),
      condition: ({ propertyId }) => promotions.length && !propertyId,
      uniforms: {
        transform: promotionId =>
          promotions.find(({ _id }) => _id === promotionId).name,
        displayEmpty: true,
        placeholder: 'Aucune',
      },
    },
  });

export default withProps(({ currentUser }) => {
  const { proProperties = [], promotions = [] } = currentUser;
  const filteredProProperties = proProperties.filter(property =>
    isAllowedToInviteCustomersToProProperty({ property, currentUser }));
  const filteredPromotions = promotions.filter(promotion =>
    isAllowedToInviteCustomersToPromotion({ promotion, currentUser }));
  return {
    schema: schema({
      proProperties: filteredProProperties,
      promotions: filteredPromotions,
    }),
    onSubmit: (model) => {
      const { propertyId, promotionId } = model;
      const referOnly = !propertyId && !promotionId;
      return proInviteUser.run({
        ...model,
        referOnly,
        proUserId: currentUser._id,
      });
    },
  };
});
