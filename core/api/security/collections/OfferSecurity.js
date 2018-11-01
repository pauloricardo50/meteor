import Security from '../Security';
import { Offers } from '../..';

class OfferSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(offerId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const offer = Offers.findOne(offerId);
    Security.checkOwnership(offer);
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }
}

export default OfferSecurity;
