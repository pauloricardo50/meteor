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
    propertyIds: {
      optional: true,
      type: Array,
      condition: () => proProperties && proProperties.length,
      uniforms: {
        displayEmpty: false,
        placeholder: '',
      },
    },
    'propertyIds.$': {
      type: String,
      optional: true,
      allowedValues: proProperties.map(({ _id }) => _id),
      uniforms: {
        transform: propertyId =>
          proProperties.find(({ _id }) => _id === propertyId).address1,
        displayEmpty: false,
      },
    },
    promotionIds: {
      optional: true,
      type: Array,
      condition: () => promotions && promotions.length,
      uniforms: {
        displayEmpty: false,
        placeholder: '',
      },
    },
    'promotionIds.$': {
      type: String,
      optional: true,
      allowedValues: promotions.map(({ _id }) => _id),
      uniforms: {
        transform: promotionId =>
          promotions.find(({ _id }) => _id === promotionId).name,
        displayEmpty: false,
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
      const { user, propertyIds = [], promotionIds = [] } = model;
      return proInviteUser.run({
        user,
        propertyIds: propertyIds.length ? propertyIds : undefined,
        promotionIds: promotionIds.length ? promotionIds : undefined,
      });
    },
  };
});
