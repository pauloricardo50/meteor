import {
  PRO_COMMISSION_STATUS,
  COMMISSION_STATUS,
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
