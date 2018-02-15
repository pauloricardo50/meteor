import Security from 'core/api/security';
import query from './admins';

query.expose({
    firewall(userId) {
        Security.checkAdmin(userId);
    }
});
