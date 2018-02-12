import Security from './Security';
import { LoanSecurity } from './CollectionSecurity';

class SecurityService {
    get loans() {
        return LoanSecurity;
    }

    get security() {
        return Security;
    }
}

export { SECURITY_ERROR } from './Security';
export default new SecurityService();
