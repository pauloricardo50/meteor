import moment from 'moment';

export const getCurrentRate = (commissionRates, referredRevenues, name) => {
  if (!commissionRates || commissionRates.length === 0) {
    return 0;
  }

  if (commissionRates.length === 1) {
    return commissionRates[0].rate;
  }

  let index = 0;

  const today = moment(new Date());

  commissionRates
    .filter(({ date }) =>
      moment(new Date(`${today.year()}-${date}`)).isSameOrBefore(today),
    )
    .some(({ threshold }, i) => {
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
