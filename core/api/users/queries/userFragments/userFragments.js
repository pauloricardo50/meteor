// Separate these fragments into separate files to avoid cyclic dependencies

export const simpleUserFragment = {
  email: 1,
  emails: 1,
  name: 1,
  firstName: 1,
  lastName: 1,
  phoneNumbers: 1,
  roles: 1,
  $options: { sort: { createdAt: -1 } },
};
