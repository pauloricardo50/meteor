export const Roles = {
  userIsInRole: (user, role) => user && user.roles && user.roles.includes(role),
};
