const makeReferrerFilter = referrer => ({ loan }) => {
  if (loan && loan.userCache && loan.userCache.referredByOrganisationLink) {
    return loan.userCache.referredByOrganisationLink === referrer;
  }

  return false;
};

export const revenuesFilter = ({ referrer, revenues }) => {
  const referrerFilter = makeReferrerFilter(referrer);

  return revenues.filter(revenue => !!(!referrer || referrerFilter(revenue)));
};
