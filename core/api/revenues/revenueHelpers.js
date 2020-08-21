import {
  COMMISSION_STATUS,
  PRO_COMMISSION_STATUS,
  REVENUE_STATUS,
} from './revenueConstants';

export const getCommissionFilters = (proCommissionStatus, organisationId) => {
  const $or = [];

  if (proCommissionStatus.includes(PRO_COMMISSION_STATUS.WAITING_FOR_REVENUE)) {
    $or.push({
      status: REVENUE_STATUS.EXPECTED,
      organisationLinks: {
        $elemMatch: {
          _id: organisationId,
          status: COMMISSION_STATUS.TO_BE_PAID,
        },
      },
    });
  }

  if (proCommissionStatus.includes(PRO_COMMISSION_STATUS.COMMISSION_TO_PAY)) {
    $or.push({
      status: REVENUE_STATUS.CLOSED,
      organisationLinks: {
        $elemMatch: {
          _id: organisationId,
          status: COMMISSION_STATUS.TO_BE_PAID,
        },
      },
    });
  }

  if (proCommissionStatus.includes(PRO_COMMISSION_STATUS.COMMISSION_PAID)) {
    $or.push({
      status: REVENUE_STATUS.CLOSED,
      organisationLinks: {
        $elemMatch: {
          _id: organisationId,
          status: COMMISSION_STATUS.PAID,
        },
      },
    });
  }

  return $or;
};

export const getProCommissionStatus = (revenueStatus, commissionStatus) =>
  revenueStatus === REVENUE_STATUS.EXPECTED
    ? PRO_COMMISSION_STATUS.WAITING_FOR_REVENUE
    : commissionStatus === COMMISSION_STATUS.TO_BE_PAID
    ? PRO_COMMISSION_STATUS.COMMISSION_TO_PAY
    : PRO_COMMISSION_STATUS.COMMISSION_PAID;

export const getProCommissionDate = ({
  revenueStatus,
  commissionStatus,
  expectedAt,
  revenuePaidAt,
  commissionPaidAt,
}) =>
  revenueStatus === REVENUE_STATUS.EXPECTED
    ? expectedAt
    : commissionStatus === COMMISSION_STATUS.TO_BE_PAID
    ? revenuePaidAt
    : commissionPaidAt;

const reduceCommissions = amount => (tot, { commissionRate }) =>
  tot + amount * commissionRate;

export const getCommissionsFromRevenues = (
  revenues,
  { filterOrganisationId } = {},
) => {
  const filterByOrg = filterOrganisationId
    ? ({ _id }) => _id === filterOrganisationId
    : x => x;

  return revenues.reduce(
    (obj, { amount, organisationLinks = [] }) => {
      const filtered = organisationLinks.filter(filterByOrg);
      const total = filtered.reduce(reduceCommissions(amount), 0);
      const tobePaid = filtered
        .filter(
          ({ status }) => !status || status === COMMISSION_STATUS.TO_BE_PAID,
        )
        .reduce(reduceCommissions(amount), 0);
      const paid = filtered
        .filter(({ status }) => status === COMMISSION_STATUS.PAID)
        .reduce(reduceCommissions(amount), 0);

      return {
        total: obj.total + total,
        [COMMISSION_STATUS.TO_BE_PAID]:
          obj[COMMISSION_STATUS.TO_BE_PAID] + tobePaid,
        [COMMISSION_STATUS.PAID]: obj[COMMISSION_STATUS.PAID] + paid,
      };
    },
    {
      total: 0,
      [COMMISSION_STATUS.TO_BE_PAID]: 0,
      [COMMISSION_STATUS.PAID]: 0,
    },
  );
};
