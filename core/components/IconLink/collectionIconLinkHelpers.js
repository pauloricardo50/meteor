export const getLoanLinkTitle = ({ name, user = {}, borrowers = [] }) => {
  const borrowerName = !!borrowers.length && borrowers[0].name;
  const userName = user.name
    || [user.firstName, user.lastName]
      .filter(x => x)
      .join(' ')
      .reverseFirstLastName();

  return borrowerName || userName || name;
};
