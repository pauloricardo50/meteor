const makeReferrerFilter = referrer => ({ loan }) => {
  if (loan && loan.userCache && loan.userCache.referredByOrganisationLink) {
    return loan.userCache.referredByOrganisationLink === referrer;
  }

  return false;
};

const makeAssigneeFilter = assignee => ({
  assigneeLink: { _id: revenueAssignee } = {},
}) => assignee === revenueAssignee;

export const revenuesFilter = ({ assignee, referrer, revenues }) => {
  const referrerFilter = makeReferrerFilter(referrer);
  const assigneeFilter = makeAssigneeFilter(assignee);

  return revenues.filter(
    revenue =>
      !!(
        (!referrer || referrerFilter(revenue)) &&
        (!assignee || assigneeFilter(revenue))
      ),
  );
};
