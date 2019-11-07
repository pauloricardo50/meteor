import { withProps } from 'recompose';
import { useHistory } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';

import {
  isAllowedToInviteCustomersToProProperty,
  isAllowedToInviteCustomersToPromotion,
} from 'core/api/security/clientSecurityHelpers/index';
import { proInviteUser } from 'core/api/methods/index';
import { createRoute } from 'core/utils/routerUtils';

const schema = ({ proProperties, promotions, history }) =>
  new SimpleSchema({
    email: String,
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    phoneNumber: { type: String, optional: true },
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
        transform: (propertyId) => {
          const { address1, city = '', zipCode = '' } = proProperties.find(({ _id }) => _id === propertyId);

          return `${address1}, ${zipCode} ${city}`;
        },
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
        handleClick: (model) => {
          const {
            promotionIds = [],
            email,
            firstName,
            lastName,
            phoneNumber,
          } = model;
          const [promotionId] = promotionIds;

          if (promotionId) {
            history.push(createRoute(
              '/promotions/:promotionId',
              { promotionId },
              { email, firstName, lastName, phoneNumber },
            ));
          }
        },
      },
    },
    'promotionIds.$': {
      type: String,
      optional: true,
      allowedValues: promotions.map(({ _id }) => _id),
      uniforms: {
        transform: (promotionId) =>
          promotions.find(({ _id }) => _id === promotionId).name,
        displayEmpty: false,
      },
    },
    invitationNote: {
      type: String,
      optional: true,
    },
  });

export default withProps(({ currentUser }) => {
  const history = useHistory();
  const { proProperties = [], promotions = [] } = currentUser;
  const filteredProProperties = proProperties
    .filter((property) =>
      isAllowedToInviteCustomersToProProperty({ property, currentUser }))
    .sort(({ address1: A }, { address1: B }) => A.localeCompare(B));
  const filteredPromotions = promotions
    .filter((promotion) =>
      isAllowedToInviteCustomersToPromotion({ promotion, currentUser }))
    .sort(({ name: A }, { name: B }) => A.localeCompare(B));
  return {
    schema: schema({
      proProperties: filteredProProperties,
      promotions: filteredPromotions,
      history,
    }),
    onSubmit: (model) => {
      const {
        propertyIds = [],
        promotionIds = [],
        invitationNote,
        ...user
      } = model;
      return proInviteUser.run({
        user,
        propertyIds: propertyIds.length ? propertyIds : undefined,
        promotionIds: promotionIds.length ? promotionIds : undefined,
        invitationNote,
      });
    },
  };
});
