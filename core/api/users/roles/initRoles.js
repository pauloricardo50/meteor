import { Roles } from 'meteor/alanning:roles';

import { ADMIN_ROLES, ROLES } from './roleConstants';

const t1 = Date.now();
console.log('Starting roles init');
Object.values(ROLES).forEach(role => {
  Roles.createRole(role, { unlessExists: true });
});

// All the admin roles have access to admin
Object.values(ADMIN_ROLES).forEach(role => {
  Roles.addRolesToParent(ROLES.ADMIN, role);
});

// All admins should have access to pro.e-potek and app.e-potek
Roles.addRolesToParent(ROLES.PRO, ROLES.ADMIN);
Roles.addRolesToParent(ROLES.USER, ROLES.PRO);

const t2 = Date.now();
console.log(`Done with roles init, it took ${t2 - t1} ms`);
