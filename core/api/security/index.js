import Security from './Security';
import {
  LoanSecurity,
  OfferSecurity,
  BorrowerSecurity,
  PropertySecurity,
  TaskSecurity,
  UserSecurity,
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

  static get tasks() {
    return TaskSecurity;
  }
}

export { SECURITY_ERROR } from './Security';
export default SecurityService;
