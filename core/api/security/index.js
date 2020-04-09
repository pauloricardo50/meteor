import {
  BorrowerSecurity,
  FileSecurity,
  LoanSecurity,
  OfferSecurity,
  PromotionSecurity,
  PropertySecurity,
  UserSecurity,
} from './collections';
import Security from './Security';

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

  static get files() {
    return FileSecurity;
  }
}

export { SECURITY_ERROR } from './Security';
export default SecurityService;
