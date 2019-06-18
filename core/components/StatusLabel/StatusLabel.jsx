// @flow
import React from 'react';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import colors from '../../config/colors';
import {
  PROMOTION_STATUS,
  PROMOTIONS_COLLECTION,
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
  PROMOTION_LOT_REDUCED_STATUS,
  TASKS_COLLECTION,
  TASK_STATUS,
  LOANS_COLLECTION,
  LOAN_STATUS,
  LENDERS_COLLECTION,
  LENDER_STATUS,
  PROPERTIES_COLLECTION,
  PROPERTY_STATUS,
  REVENUES_COLLECTION,
  REVENUE_STATUS,
} from '../../api/constants';
import T from '../Translation';
import DropdownMenu from '../DropdownMenu';
import { updateDocument } from '../../api/methods/methodDefinitions';

type StatusLabelProps = {
  status: string,
  collection: string,
  suffix?: string,
  label: React.Node,
  color: string,
};

const getStatuses = (collection) => {
  switch (collection) {
  case LOANS_COLLECTION:
    return {
      [LOAN_STATUS.LEAD]: colors.secondary,
      [LOAN_STATUS.ONGOING]: colors.primary,
      [LOAN_STATUS.PENDING]: colors.warning,
      [LOAN_STATUS.CLOSING]: colors.tertiary,
      [LOAN_STATUS.BILLING]: colors.success,
      [LOAN_STATUS.FINALIZED]: colors.success,
      [LOAN_STATUS.UNSUCCESSFUL]: colors.error,
      [LOAN_STATUS.TEST]: colors.warning,
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
      [PROMOTION_LOT_STATUS.BOOKED]: colors.primary,
      [PROMOTION_LOT_STATUS.SOLD]: colors.error,
      [PROMOTION_LOT_REDUCED_STATUS.SOLD_TO_ME]: colors.tertiary,
      [PROMOTION_LOT_REDUCED_STATUS.BOOKED_FOR_ME]: colors.primary,
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
      [PROPERTY_STATUS.BOOKED]: colors.primary,
      [PROPERTY_STATUS.SOLD]: colors.error,
    };

  case REVENUES_COLLECTION:
    return {
      [REVENUE_STATUS.EXPECTED]: colors.primary,
      [REVENUE_STATUS.CLOSED]: colors.success,
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
}) => {
  switch (variant) {
  case 'full':
    return props => (
      <span
        className={cx({ allowModify, 'status-label': true })}
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
      (showTooltip ? (
        <Tooltip title={label || <T id={`Forms.status.${status}`} />}>
          <span
            className={cx({ allowModify, 'status-label-dot': true })}
            style={{ backgroundColor: color || statuses[status] }}
            {...props}
          />
        </Tooltip>
      ) : (
        <span
          className={cx({ allowModify, 'status-label-dot': true })}
          style={{ backgroundColor: color || statuses[status] }}
          {...props}
        />
      ));

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
}: StatusLabelProps) => {
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
            additionalActions(stat, status).then(() =>
              updateDocument.run({
                collection,
                object: { status: stat },
                docId,
              })),
        }))}
      />
    );
  }

  return statusLabel({ showTooltip });
};

export default StatusLabel;
