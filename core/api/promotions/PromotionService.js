import { Meteor } from 'meteor/meteor';
import Promotions from './promotions';
import { PROMOTION_USER_PERMISSIONS } from './promotionConstants';
import UserService from '../users/UserService';
import LoanService from '../loans/LoanService';
import CollectionService from '../helpers/CollectionService';
import PropertyService from '../properties/PropertyService';
import PromotionLotService from '../promotionLots/PromotionLotService';

export class PromotionService extends CollectionService {
  constructor() {
    super(Promotions);
  }

  insert({ promotion = {}, userId }) {
    return super.insert({
      ...promotion,
      userLinks: [
        {
          _id: userId,
          permissions: PROMOTION_USER_PERMISSIONS.MODIFY,
        },
      ],
    });
  }

  insertPromotionProperty({ promotionId, property }) {
    const propertyId = PropertyService.insert({ property });
    const promotionLotId = PromotionLotService.insert({
      propertyLinks: [{ _id: propertyId }],
    });
    this.addLink({
      id: promotionId,
      linkName: 'promotionLotLinks',
      linkId: promotionLotId,
    });
    this.addLink({
      id: promotionId,
      linkName: 'propertyLinks',
      linkId: propertyId,
    });

    return promotionLotId;
  }

  update({ promotionId, ...rest }) {
    return super.update({ id: promotionId, ...rest });
  }

  remove({ promotionId }) {
    return super.remove(promotionId);
  }

  inviteUser({ promotionId, userId }) {
    if (UserService.hasPromotion({ userId, promotionId })) {
      throw new Meteor.Error('Cet utilisateur est déjà invité à cette promotion');
    }
    const loanId = LoanService.adminLoanInsert({ userId });
    LoanService.update({
      loanId,
      object: { promotionLinks: [{ _id: promotionId }] },
    });

    return loanId;
  }
}

export default new PromotionService();
