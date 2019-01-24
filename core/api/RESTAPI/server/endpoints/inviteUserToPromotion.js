import { DOCUMENT_USER_PERMISSIONS } from '../../../constants';
import { REST_API_ERRORS, HTTP_STATUS_CODES } from '../constants';
import PromotionService from '../../../promotions/server/PromotionService';
import { makeCheckObjectStructure } from '../../../../utils/checkObjectStructure';

const INVITE_USER_BODY_TEMPLATE = {
  promotionId: 1,
  user: { email: 1, firstName: 1, lastName: 1 },
};

const checkPermissions = ({ userId, body: { promotionId } }) => {
  const promotion = PromotionService.get(promotionId);
  if (!promotion) {
    return REST_API_ERRORS.PROMOTION_NOT_FOUND(promotionId);
  }

  const userLinked = promotion.userLinks.find(({ _id }) => _id === userId);
  const permissions = userLinked && userLinked.permissions;

  if (!userLinked || permissions !== DOCUMENT_USER_PERMISSIONS.MODIFY) {
    return REST_API_ERRORS.NOT_ALLOWED_TO_MODIFY_PROMOTION;
  }

  return null;
};

const checkStructure = ({ body }) => {
  try {
    const checkObjectStructure = makeCheckObjectStructure({
      missingKey: (key, parentKey) =>
        REST_API_ERRORS.MISSING_KEY({ key, object: parentKey }),
    });
    checkObjectStructure({ obj: body, template: INVITE_USER_BODY_TEMPLATE });
  } catch (error) {
    return error;
  }

  return null;
};

const verifyData = params => checkStructure(params) || checkPermissions(params);

export const inviteUserToPromotion = api => (
  { user: { _id: userId }, body },
  res,
) => {
  const error = verifyData({ api, res, userId, body });
  if (error) {
    return api.sendResponse({ res, data: error });
  }
  const { promotionId, user, testing } = body;
  try {
    const promise = testing
      ? Promise.resolve()
      : PromotionService.inviteUser({
        promotionId,
        user: { ...user, invitedBy: userId },
      });

    return promise.then(() =>
      api.sendResponse({
        res,
        data: {
          statusCode: HTTP_STATUS_CODES.OK,
          body: {
            message: testing
              ? `Test mode: user "${
                user.email
              }" would've been successfully invited to promotion id "${promotionId}"! Yay :)`
              : `Successfully invited user "${
                user.email
              }" to promotion id "${promotionId}"`,
          },
        },
      }));
  } catch (err) {
    return api.sendResponse({
      res,
      data: {
        statusCode: HTTP_STATUS_CODES.FORBIDDEN,
        body: { message: err.message },
      },
    });
  }
};
