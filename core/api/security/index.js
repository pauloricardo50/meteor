import Security from './Security';
import LoanSecurity from './collections/LoanSecurity';

class SecurityService extends Security {
    static get loans() {
        return LoanSecurity;
    }
}

export { SECURITY_ERROR } from './Security';
export default SecurityService;
