import React from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCheckCircle } from '@fortawesome/pro-duotone-svg-icons/faCheckCircle';
import { faCircle as duoToneCircle } from '@fortawesome/pro-duotone-svg-icons/faCircle';
import { faClock } from '@fortawesome/pro-duotone-svg-icons/faClock';
import { faDonate } from '@fortawesome/pro-duotone-svg-icons/faDonate';
import { faExclamationCircle } from '@fortawesome/pro-duotone-svg-icons/faExclamationCircle';
import { faFileCertificate } from '@fortawesome/pro-duotone-svg-icons/faFileCertificate';
import { faFileSignature } from '@fortawesome/pro-duotone-svg-icons/faFileSignature';
import { faFileUpload } from '@fortawesome/pro-duotone-svg-icons/faFileUpload';
import { faHandshake } from '@fortawesome/pro-duotone-svg-icons/faHandshake';
import { faIdCard } from '@fortawesome/pro-duotone-svg-icons/faIdCard';
import { faPaperPlane } from '@fortawesome/pro-duotone-svg-icons/faPaperPlane';
import { faUniversity } from '@fortawesome/pro-duotone-svg-icons/faUniversity';

import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
} from '../../../api/promotionOptions/promotionOptionConstants';
import colors from '../../../config/colors';
import CircularProgress from '../../CircularProgress';
import FaIcon from '../../Icon/FaIcon';
import T from '../../Translation';

export const TIMELINE_ICON_STATES = {
  TO_DO: {
    IconComponent: () => (
      <FaIcon icon={duoToneCircle} color={colors.borderGrey} />
    ),
    color: '#888',
  },
  DONE: {
    IconComponent: () => (
      <FaIcon icon={faCheckCircle} color={colors.success} size="24px" />
    ),
    color: colors.success,
  },
  DONE_WITH_WARNING: {
    IconComponent: () => (
      <FaIcon icon={faExclamationCircle} color={colors.warning} />
    ),
    color: colors.success,
  },
  INVALID: {
    IconComponent: () => (
      <FaIcon
        icon={faExclamationCircle}
        primaryColor={colors.error}
        secondaryColor={colors.error}
      />
    ),
    color: colors.error,
  },
  SENT: {
    IconComponent: () => (
      <span className="fa-layers">
        <FaIcon icon={faCircle} color={colors.warning} />
        <FaIcon icon={faPaperPlane} transform="shrink-7" color="white" />
      </span>
    ),
    color: colors.warning,
  },
  WAITING: {
    IconComponent: () => <FaIcon icon={faClock} color={colors.warning} />,
    color: colors.warning,
  },
};

const getPercent = ({ valid, required }) => {
  if (valid === 0 || required === 0) {
    return 0;
  }

  return valid / required;
};

const getProgressDescription = data =>
  `${data.valid}/${data.required} (${Math.round(getPercent(data) * 100)}%)`;

export const PROMOTION_OPTION_ICONS = {
  simpleVerification: ({ simpleVerification: { status, date } }) => {
    const base = {
      detailIcon: faHandshake,
      isActive: true,
      isCompleted:
        PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED === status,
      description: <T id={`Forms.status.${status}`} />,
      date,
    };

    switch (status) {
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE:
        return { ...base, ...TIMELINE_ICON_STATES.TO_DO };
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.CALCULATED:
        return { ...base, ...TIMELINE_ICON_STATES.WAITING };
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED:
        return { ...base, ...TIMELINE_ICON_STATES.DONE };
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.REJECTED:
        return { ...base, ...TIMELINE_ICON_STATES.INVALID };
      default:
        return {};
    }
  },
  info: ({ info }) => {
    const percent = getPercent(info);
    return {
      ...(percent > 0 ? { color: colors.primary } : TIMELINE_ICON_STATES.TO_DO),
      detailIcon: faIdCard,
      isActive: true,
      isCompleted: percent >= 1,
      IconComponent: () => <CircularProgress percent={percent} />,
      description: getProgressDescription(info),
    };
  },
  documents: ({ documents }) => {
    const percent = getPercent(documents);
    return {
      ...(percent > 0 ? { color: colors.primary } : TIMELINE_ICON_STATES.TO_DO),
      detailIcon: faFileUpload,
      isActive: () => true,
      isCompleted: percent >= 1,
      IconComponent: () => <CircularProgress percent={percent} />,
      description: getProgressDescription(documents),
    };
  },
  fullVerification: ({
    fullVerification: { status, date },
    simpleVerification,
  }) => {
    const base = {
      detailIcon: faFileCertificate,
      isCompleted:
        status === PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
      isActive:
        simpleVerification.status ===
        PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
      description: <T id={`Forms.status.${status}`} />,
      date,
    };

    switch (status) {
      case PROMOTION_OPTION_FULL_VERIFICATION_STATUS.INCOMPLETE:
        return { ...base, ...TIMELINE_ICON_STATES.TO_DO };
      case PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED:
        return { ...base, ...TIMELINE_ICON_STATES.DONE };
      case PROMOTION_OPTION_FULL_VERIFICATION_STATUS.REJECTED:
        return { ...base, ...TIMELINE_ICON_STATES.INVALID };
      default:
        return {};
    }
  },
  bank: ({ bank: { status, date }, fullVerification }) => {
    const base = {
      detailIcon: faUniversity,
      isActive:
        fullVerification.status ===
        PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
      isCompleted: [
        PROMOTION_OPTION_BANK_STATUS.VALIDATED,
        PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS,
      ].includes(status),
      description: <T id={`Forms.status.${status}`} />,
      date,
    };

    switch (status) {
      case PROMOTION_OPTION_BANK_STATUS.INCOMPLETE:
        return { ...base, ...TIMELINE_ICON_STATES.TO_DO };
      case PROMOTION_OPTION_BANK_STATUS.WAITLIST:
        return { ...base, ...TIMELINE_ICON_STATES.WAITING };
      case PROMOTION_OPTION_BANK_STATUS.SENT:
        return { ...base, ...TIMELINE_ICON_STATES.SENT };
      case PROMOTION_OPTION_BANK_STATUS.REJECTED:
        return { ...base, ...TIMELINE_ICON_STATES.INVALID };
      case PROMOTION_OPTION_BANK_STATUS.VALIDATED:
        return { ...base, ...TIMELINE_ICON_STATES.DONE };
      case PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS:
        return { ...base, ...TIMELINE_ICON_STATES.DONE_WITH_WARNING };
      default:
        return {};
    }
  },
  reservationAgreement: ({ reservationAgreement: { status, date } }) => {
    const base = {
      detailIcon: faFileSignature,
      isCompleted: status === PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
      description: <T id={`Forms.status.${status}`} />,
      date,
    };

    switch (status) {
      case PROMOTION_OPTION_AGREEMENT_STATUS.WAITING:
        return { ...base, ...TIMELINE_ICON_STATES.TO_DO };
      case PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED:
        return { ...base, ...TIMELINE_ICON_STATES.DONE };
      case PROMOTION_OPTION_AGREEMENT_STATUS.EXPIRED:
        return { ...base, ...TIMELINE_ICON_STATES.INVALID };
      default:
        return {};
    }
  },
  reservationDeposit: ({ reservationDeposit: { status, date } }) => {
    const base = {
      detailIcon: faDonate,
      isCompleted: status === PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
      description: <T id={`Forms.status.${status}`} />,
      date,
    };

    switch (status) {
      case PROMOTION_OPTION_DEPOSIT_STATUS.WAITING:
        return { ...base, ...TIMELINE_ICON_STATES.TO_DO };
      case PROMOTION_OPTION_DEPOSIT_STATUS.PAID:
        return { ...base, ...TIMELINE_ICON_STATES.DONE };
      default:
        return {};
    }
  },
};
