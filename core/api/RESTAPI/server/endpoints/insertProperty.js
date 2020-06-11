import { proPropertyInsert } from '../../../properties/methodDefinitions';
import PropertyService from '../../../properties/server/PropertyService';
import Security from '../../../security';
import { withMeteorUserId } from '../helpers';
import { HTTP_STATUS_CODES } from '../restApiConstants';
import { checkQuery, getImpersonateUserId, impersonateSchema } from './helpers';

export const apiProperty = {
  externalId: 1,
  address1: 1,
  address2: 1,
  city: 1,
  zipCode: 1,
  value: 1,
  description: 1,
  propertyType: 1,
  houseType: 1,
  flatType: 1,
  roomCount: 1,
  insideArea: 1,
  landArea: 1,
  terraceArea: 1,
  constructionYear: 1,
  externalUrl: 1,
  useOpenGraph: 1,
  imageUrls: 1,
  country: 1,
  status: 1,
};

const insertPropertyAPI = ({
  user: { _id: userId },
  body: property,
  query,
}) => {
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

  const { externalId } = property;

  if (externalId) {
    const propertyByExternalId = PropertyService.get(
      { externalId },
      apiProperty,
    );

    if (propertyByExternalId) {
      const { _id: propertyId } = propertyByExternalId;
      return withMeteorUserId({ userId, impersonateUser }, () => {
        let impersonateUserId;
        let displayProperty = true;
        if (impersonateUser) {
          impersonateUserId = getImpersonateUserId({ userId, impersonateUser });
        }

        try {
          Security.properties.hasAccessToProperty({
            propertyId,
            userId: impersonateUserId || userId,
          });
        } catch (error) {
          displayProperty = false;
        }

        return {
          status: HTTP_STATUS_CODES.CONFLICT,
          message: `A property with externalId "${externalId}" already exists !`,
          ...(displayProperty ? { property: propertyByExternalId } : {}),
        };
      });
    }
  }

  return withMeteorUserId({ userId, impersonateUser }, () => {
    let impersonateUserId;
    if (impersonateUser) {
      impersonateUserId = getImpersonateUserId({ userId, impersonateUser });
    }
    return proPropertyInsert
      .run({ userId: impersonateUserId || userId, property })
      .then(propertyId => {
        const insertedProperty = PropertyService.get(propertyId, apiProperty);

        return {
          message: `Successfully inserted property with id "${propertyId}"`,
          property: insertedProperty,
        };
      });
  });
};

export default insertPropertyAPI;
