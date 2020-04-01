import React from 'react';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCES_COLLECTION,
  INSURANCE_STATUS,
} from 'core/api/constants';
import colors from '../../config/colors';
import {
  PROMOTION_STATUS,
  PROMOTIONS_COLLECTION,
} from '../../api/promotions/promotionConstants';
import {
  PROMOTION_LOT_STATUS,
  PROMOTION_LOT_REDUCED_STATUS,
  PROMOTION_LOTS_COLLECTION,
} from '../../api/promotionLots/promotionLotConstants';
import {
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_OPTION_STATUS,
} from '../../api/promotionOptions/promotionOptionConstants';
import { TASKS_COLLECTION, TASK_STATUS } from '../../api/tasks/taskConstants';
import { LOANS_COLLECTION, LOAN_STATUS } from '../../api/loans/loanConstants';
import {
  REVENUES_COLLECTION,
  REVENUE_STATUS,
  COMMISSION_STATUS,
} from '../../api/revenues/revenueConstants';
import {
  PROPERTIES_COLLECTION,
  PROPERTY_STATUS,
} from '../../api/properties/propertyConstants';
import {
  LENDERS_COLLECTION,
  LENDER_STATUS,
} from '../../api/lenders/lenderConstants';

import T from '../Translation';
import DropdownMenu from '../DropdownMenu';
import { updateDocument } from '../../api/methods/methodDefinitions';

export const getStatuses = collection => {
  switch (collection) {
    case LOANS_COLLECTION:
      return {
        [LOAN_STATUS.LEAD]: colors.mix,
        [LOAN_STATUS.QUALIFIED_LEAD]: colors.secondary,
        [LOAN_STATUS.ONGOING]: colors.primary,
        [LOAN_STATUS.PENDING]: colors.warning,
        [LOAN_STATUS.CLOSING]: colors.tertiary,
        [LOAN_STATUS.BILLING]: colors.success,
        [LOAN_STATUS.FINALIZED]: colors.success,
        [LOAN_STATUS.UNSUCCESSFUL]: colors.error,
        [LOAN_STATUS.TEST]: colors.warning,
      };

    case INSURANCE_REQUESTS_COLLECTION:
      return {
        [INSURANCE_REQUEST_STATUS.LEAD]: colors.mix,
        [INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD]: colors.secondary,
        [INSURANCE_REQUEST_STATUS.ONGOING]: colors.primary,
        [INSURANCE_REQUEST_STATUS.PENDING]: colors.warning,
        [INSURANCE_REQUEST_STATUS.CLOSING]: colors.tertiary,
        [INSURANCE_REQUEST_STATUS.BILLING]: colors.success,
        [INSURANCE_REQUEST_STATUS.FINALIZED]: colors.success,
        [INSURANCE_REQUEST_STATUS.UNSUCCESSFUL]: colors.error,
        [INSURANCE_REQUEST_STATUS.TEST]: colors.warning,
      };

    case PROMOTIONS_COLLECTION:
      return {
        [PROMOTION_STATUS.CANCELLED]: colors.warning,
        [PROMOTION_STATUS.FINISHED]: colors.error,
        [PROMOTION_STATUS.OPEN]: colors.success,
        [PROMOTION_STATUS.PREPARATION]: colors.primary,
      };

    case PROMOTION_LOTS_COLLECTION:
      return {
        [PROMOTION_LOT_STATUS.AVAILABLE]: colors.success,
        [PROMOTION_LOT_STATUS.RESERVED]: colors.primary,
        [PROMOTION_LOT_STATUS.SOLD]: colors.error,
        [PROMOTION_LOT_REDUCED_STATUS.SOLD_TO_ME]: colors.tertiary,
        [PROMOTION_LOT_REDUCED_STATUS.RESERVED_FOR_ME]: colors.primary,
        [PROMOTION_LOT_REDUCED_STATUS.NOT_AVAILABLE]: colors.warning,
      };

    case TASKS_COLLECTION:
      return {
        [TASK_STATUS.ACTIVE]: colors.primary,
        [TASK_STATUS.COMPLETED]: colors.success,
        [TASK_STATUS.CANCELLED]: colors.error,
      };

    case LENDERS_COLLECTION:
      return {
        [LENDER_STATUS.TO_BE_CONTACTED]: colors.warning,
        [LENDER_STATUS.CONTACTED]: colors.primary,
        [LENDER_STATUS.OFFER_RECEIVED]: colors.success,
        [LENDER_STATUS.TO_EXCLUDE]: colors.error,
      };

    case PROPERTIES_COLLECTION:
      return {
        [PROPERTY_STATUS.FOR_SALE]: colors.success,
        [PROPERTY_STATUS.RESERVED]: colors.primary,
        [PROPERTY_STATUS.SOLD]: colors.error,
      };

    case REVENUES_COLLECTION:
      return {
        [REVENUE_STATUS.EXPECTED]: colors.primary,
        [REVENUE_STATUS.CLOSED]: colors.success,
        [COMMISSION_STATUS.TO_BE_PAID]: colors.primary,
        [COMMISSION_STATUS.PAID]: colors.success,
      };

    case PROMOTION_OPTIONS_COLLECTION:
      return {
        [PROMOTION_OPTION_STATUS.INTERESTED]: colors.secondary,
        [PROMOTION_OPTION_STATUS.RESERVATION_REQUESTED]: colors.primary,
        [PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED]: colors.error,
        [PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED]: colors.error,
        [PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE]: colors.tertiary,
        [PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST]: colors.warning,
        [PROMOTION_OPTION_STATUS.RESERVED]: colors.primary,
        [PROMOTION_OPTION_STATUS.SOLD]: colors.error,
      };

    case INSURANCES_COLLECTION:
      return {
        [INSURANCE_STATUS.SUGGESTED]: colors.mix,
        [INSURANCE_STATUS.SIGNED]: colors.tertiary,
        [INSURANCE_STATUS.DECLINED]: colors.error,
        [INSURANCE_STATUS.POLICED]: colors.success,
      };

    default:
      throw new Error(`Unknown collection "${collection}" in StatusLabel`);
  }
};

const getLabel = ({
  allowModify,
  color,
  label,
  status,
  statuses,
  suffix,
  variant,
  className,
  small,
}) => {
  switch (variant) {
    case 'full':
      return props => (
        <span
          className={cx('status-label', { allowModify, small }, className)}
          style={{ backgroundColor: color || statuses[status] }}
          {...props}
        >
          <span>
            {label || <T id={`Forms.status.${status}`} />}
            {suffix}
          </span>
        </span>
      );
    case 'dot':
      return ({ showTooltip, ...props }) =>
        showTooltip ? (
          <Tooltip title={label || <T id={`Forms.status.${status}`} />}>
            <span
              className={cx('status-label-dot', { allowModify }, className)}
              {...props}
            >
              <span style={{ backgroundColor: color || statuses[status] }} />
            </span>
          </Tooltip>
        ) : (
          <span
            className={cx('status-label-dot', { allowModify }, className)}
            {...props}
          >
            <span style={{ backgroundColor: color || statuses[status] }} />
          </span>
        );

    default:
      break;
  }
};

const StatusLabel = ({
  status,
  collection,
  suffix = '',
  label = null,
  color = null,
  allowModify,
  docId,
  additionalActions = () => Promise.resolve(),
  variant = 'full',
  showTooltip = true,
  method,
  className,
  small,
}) => {
  const statuses = getStatuses(collection);
  const statusLabel = getLabel({
    allowModify,
    color,
    docId,
    label,
    status,
    statuses,
    suffix,
    variant,
    className,
    small,
  });

  if (allowModify) {
    return (
      <DropdownMenu
        noWrapper
        renderTrigger={({ handleOpen }) =>
          statusLabel({ onClick: handleOpen, showTooltip })
        }
        options={Object.keys(statuses).map(stat => ({
          id: stat,
          label: <T id={`Forms.status.${stat}`} />,
          onClick: () =>
            additionalActions(stat, status).then(() => {
              if (method) {
                return method(stat);
              }

              return updateDocument.run({
                collection,
                object: { status: stat },
                docId,
              });
            }),
        }))}
      />
    );
  }

  return statusLabel({ showTooltip });
};

export default StatusLabel;
