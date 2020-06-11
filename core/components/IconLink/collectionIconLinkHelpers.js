export const getLoanLinkTitle = ({ name, user = {}, borrowers = [] }) => {
  const borrowerName = !!borrowers.length && borrowers[0].name;
  const userName =
    user.name || [user.firstName, user.lastName].filter(x => x).join(' ');

  return borrowerName || userName || name;
};

export const getInsuranceRequestLinkTitle = ({
  name,
  user = {},
  borrowers = [],
}) => {
  const borrowerName = !!borrowers.length && borrowers[0].name;
  const userName =
    user.name || [user.firstName, user.lastName].filter(x => x).join(' ');

  return borrowerName || userName || name;
};

export const getInsuranceLinkTitle = ({
  name,
  borrower,
  insuranceRequest = {},
}) => {
  const borrowerName = borrower?.name;
  const { user = {} } = insuranceRequest;
  const userName =
    user.name || [user.firstName, user.lastName].filter(x => x).join(' ');

  return borrowerName || userName || name;
};
