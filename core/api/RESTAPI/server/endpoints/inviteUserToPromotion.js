import { DOCUMENT_USER_PERMISSIONS } from '../../../constants';
import { REST_API_ERRORS, HTTP_STATUS_CODES } from '../constants';
import PromotionService from '../../../promotions/PromotionService';
import { makeCheckObjectStructure } from '../../../../utils/checkObjectStructure';

const INVITE_USER_BODY_TEMPLATE = {
  promotionId: 1,
  user: { email: 1, firstName: 1, lastName: 1, phoneNumber: 1 },
};

const checkPermissions = ({ api, res, userId, body: { promotionId } }) => {
  const promotion = PromotionService.get(promotionId);
  if (!promotion) {
    return api.sendResponse({
      res,
      data: REST_API_ERRORS.PROMOTION_NOT_FOUND(promotionId),
    });
  }

  const userLinked = promotion.userLinks.find(({ _id }) => _id === userId);
  const permissions = userLinked && userLinked.permissions;

  if (!userLinked || permissions !== DOCUMENT_USER_PERMISSIONS.MODIFY) {
    return api.sendResponse({
      res,
      data: REST_API_ERRORS.NOT_ALLOWED_TO_MODIFY_PROMOTION,
    });
  }
};

const checkStructure = ({ api, res, body }) => {
  try {
    const checkObjectStructure = makeCheckObjectStructure({
      missingKey: (key, parentKey) =>
        REST_API_ERRORS.MISSING_KEY({ key, object: parentKey }),
    });
    checkObjectStructure({ obj: body, template: INVITE_USER_BODY_TEMPLATE });
  } catch (error) {
    return api.sendResponse({ res, data: error });
  }
};

const verifyData = ({ api, res, userId, body }) => {
  checkStructure({ api, res, body });
  checkPermissions({ api, res, userId, body });
};

export const inviteUserToPromotion = api => (
  { user: { _id: userId }, body },
  res,
) => {
  verifyData({ api, res, userId, body });
  const { promotionId, user } = body;
  try {
    return PromotionService.inviteUser({ promotionId, user }).then(() =>
      api.sendResponse({
        res,
        data: {
          statusCode: HTTP_STATUS_CODES.OK,
          body: {
            message: `Invited user ${
              user.email
            } to promotion id ${promotionId}`,
          },
        },
      }));
  } catch (error) {
    return api.sendResponse({
      res,
      data: {
        statusCode: HTTP_STATUS_CODES.FORBIDDEN,
        body: { message: error.message },
      },
    });
  }
};
