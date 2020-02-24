export const getCurrentRate = (commissionRates, referredRevenues, name) => {
  if (!commissionRates || commissionRates.length === 0) {
    return 0;
  }

  if (commissionRates.length === 1) {
    return commissionRates[0].rate;
  }

  let index = 0;

  commissionRates.some(({ threshold }, i) => {
    if (threshold > referredRevenues) {
      index = i - 1;
      return true;
    }

    index = i;
    return false;
  });

  // for misconfigured commissionRates
  if (index < 0) {
    return 0;
  }

  return commissionRates[index].rate;
};
