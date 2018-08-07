export const getBorrowerFullName = ({ firstName, lastName }) =>
  [firstName, lastName].filter(name => name).join(' ');
