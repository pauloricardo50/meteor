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
    'user.email': String,
    'user.firstName': String,
    'user.lastName': String,
    'user.phoneNumber': String,
    referOnly: { type: Boolean, defaultValue: false },
    propertyId: {
      optional: true,
      type: String,
      // defaultValue: null,
      allowedValues: proProperties.map(({ _id }) => _id),
      condition: ({ promotionId, referOnly }) => !referOnly && !promotionId,
      uniforms: {
        transform: propertyId =>
          proProperties.find(({ _id }) => _id === propertyId).address1,
        displayEmpty: false,
        placeholder: '',
      },
    },
    promotionId: {
      optional: true,
      type: String,
      // defaultValue: null,
      allowedValues: promotions.map(({ _id }) => _id),
      condition: ({ propertyId, referOnly }) => !referOnly && !propertyId,
      uniforms: {
        transform: promotionId =>
          promotions.find(({ _id }) => _id === promotionId).name,
        displayEmpty: false,
        placeholder: '',
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
    onSubmit: model =>
      proInviteUser.run({ ...model, proUserId: currentUser._id }),
  };
});
