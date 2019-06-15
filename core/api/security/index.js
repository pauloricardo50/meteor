import Security from './Security';
import {
  LoanSecurity,
  OfferSecurity,
  BorrowerSecurity,
  PropertySecurity,
  UserSecurity,
  PromotionSecurity,
} from './collections';

class SecurityService extends Security {
  static get users() {
    return UserSecurity;
  }

  static get loans() {
    return LoanSecurity;
  }

  static get offers() {
    return OfferSecurity;
  }

  static get properties() {
    return PropertySecurity;
  }

  static get borrowers() {
    return BorrowerSecurity;
  }

  static get promotions() {
    return PromotionSecurity;
  }
}

export { SECURITY_ERROR } from './Security';
export default SecurityService;
