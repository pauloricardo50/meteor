import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-duotone-svg-icons/faCheckCircle';
import { faCircle } from '@fortawesome/pro-duotone-svg-icons/faCircle';
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
import FaIcon from '../../Icon/FaIcon';

export const TIMELINE_ICON_STATES = {
  TO_DO: {
    icon: <FaIcon icon={faCircle} fixedWidth color={colors.borderGrey} />,
  },
  DONE: {
    icon: <FaIcon icon={faCheckCircle} fixedWidth color={colors.borderGrey} />,
  },
  DONE_WITH_WARNING: {
    icon: (
      <FaIcon icon={faExclamationCircle} fixedWidth color={colors.warning} />
    ),
  },
  INVALID: {
    icon: <FaIcon icon={faExclamationCircle} fixedWidth color={colors.error} />,
  },
  SENT: {
    icon: (
      <span className="fa-layers fa-fw">
        <FaIcon icon={faCircle} color={colors.warning} />
        <FaIcon icon={faPaperPlane} transform="shrink-4" color="white" />
      </span>
    ),
  },
  WAITING: {
    icon: <FaIcon icon={faClock} fixedWidth color={colors.warning} />,
  },
};

export const PROMOTION_OPTION_ICONS = {
  simpleVerification: ({ simpleVerification: { status } }) => {
    const base = { detailIcon: faHandshake };

    switch (status) {
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE:
        return { ...base, mainIcon: 'TO_DO' };
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.CALCULATED:
        return { ...base, mainIcon: 'WAITING' };
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED:
        return { ...base, mainIcon: 'DONE' };
      case PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.REJECTED:
        return { ...base, mainIcon: 'INVALID' };
      default:
        return {};
    }
  },
  info: {
    mainIcon: faIdCard,
  },
  documents: {
    mainIcon: faFileUpload,
  },
  fullVerification: ({ fullVerification: { status } }) => {
    const base = { detailIcon: faFileCertificate };

    switch (status) {
      case PROMOTION_OPTION_FULL_VERIFICATION_STATUS.INCOMPLETE:
        return { ...base, mainIcon: 'TO_DO' };
      case PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED:
        return { ...base, mainIcon: 'DONE' };
      case PROMOTION_OPTION_FULL_VERIFICATION_STATUS.REJECTED:
        return { ...base, mainIcon: 'INVALID' };
      default:
        return {};
    }
  },
  bank: ({ bank: { status } }) => {
    const base = { detailIcon: faUniversity };

    switch (status) {
      case PROMOTION_OPTION_BANK_STATUS.INCOMPLETE:
        return { ...base, mainIcon: 'TO_DO' };
      case PROMOTION_OPTION_BANK_STATUS.WAITLIST:
        return { ...base, mainIcon: 'WAITING' };
      case PROMOTION_OPTION_BANK_STATUS.SENT:
        return { ...base, mainIcon: 'SENT' };
      case PROMOTION_OPTION_BANK_STATUS.REJECTED:
        return { ...base, mainIcon: 'INVALID' };
      case PROMOTION_OPTION_BANK_STATUS.VALIDATED:
        return { ...base, mainIcon: 'DONE' };
      case PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS:
        return { ...base, mainIcon: 'DONE_WITH_WARNING' };
      default:
        return {};
    }
  },
  reservationAgreement: ({ reservationAgreement: { status } }) => {
    const base = { detailIcon: faFileSignature };

    switch (status) {
      case PROMOTION_OPTION_AGREEMENT_STATUS.WAITING:
        return { ...base, mainIcon: 'TO_DO' };
      case PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED:
        return { ...base, mainIcon: 'DONE' };
      case PROMOTION_OPTION_AGREEMENT_STATUS.EXPIRED:
        return { ...base, mainIcon: 'INVALID' };
      default:
        return {};
    }
  },
  reservationDeposit: ({ reservationAgreement: { status } }) => {
    const base = { detailIcon: faFileSignature };

    switch (status) {
      case PROMOTION_OPTION_DEPOSIT_STATUS.WAITING:
        return { ...base, mainIcon: 'TO_DO' };
      case PROMOTION_OPTION_DEPOSIT_STATUS.PAID:
        return { ...base, mainIcon: 'DONE' };
      default:
        return {};
    }
  },
};
