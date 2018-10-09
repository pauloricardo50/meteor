import { Meteor } from 'imports/core/utils/testHelpers/meteorStubs/meteor';
import Promotions from './promotions';
import { PROMOTION_USER_PERMISSIONS } from './promotionConstants';
import UserService from '../users/UserService';
import LoanService from '../loans/LoanService';

export class PromotionService {
  insert = ({ promotion = {}, userId }) =>
    Promotions.insert({
      ...promotion,
      userLinks: [
        {
          _id: userId,
          permissions: PROMOTION_USER_PERMISSIONS.MODIFY,
        },
      ],
    });

  update = ({ promotionId, object, operator = '$set' }) =>
    Promotions.update(promotionId, { [operator]: object });

  remove = ({ promotionId }) => Promotions.remove(promotionId);

  inviteUser = ({ promotionId, userId }) => {
    if (UserService.hasPromotion({ userId, promotionId })) {
      throw new Meteor.Error('This user was already invited to this promotion');
    }
    const loanId = LoanService.adminLoanInsert({ userId });
    return LoanService.update({
      loanId,
      object: { promotionLinks: [{ _id: promotionId }] },
    });
  };
}

export default new PromotionService();
