import { Accounts } from 'meteor/accounts-base';

import UserService from '../UserService';

Accounts.onCreateUser(UserService.onCreateUser);
Accounts.config({ forbidClientAccountCreation: false });
