const makeAssigneeFilter = assignee => ({ loan }) => {
  if (loan && loan.userCache && loan.userCache.assignedEmployeeCache) {
    return loan.userCache.assignedEmployeeCache._id === assignee;
  }

  return false;
};

const makeReferrerFilter = referrer => ({ loan }) => {
  if (loan && loan.userCache && loan.userCache.referredByOrganisationLink) {
    return loan.userCache.referredByOrganisationLink === referrer;
  }

  return false;
};

export const revenuesFilter = ({ assignee, referrer, revenues }) => {
  const assigneeFilter = makeAssigneeFilter(assignee);
  const referrerFilter = makeReferrerFilter(referrer);

  return revenues.filter(
    revenue =>
      true &&
      (!assignee || assigneeFilter(revenue)) &&
      (!referrer || referrerFilter(revenue)),
  );
};
