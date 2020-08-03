import moment from 'moment';

import { employeesByEmail } from '../../../arrays/epotekEmployees';
import ServerEventService from '../../events/server/ServerEventService';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import {
  loanShareSolvency,
  notifyInsuranceTeamForPotential,
  setMaxPropertyValueOrBorrowRatio,
} from '../../loans/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import { generateDisbursedSoonLoansTasks } from '../../loans/server/methods';
import {
  generateExpiringSoonReservationTasks,
  generateTenDayExpirationReminderTasks,
} from '../../promotionOptions/server/methods';
import { submitPromotionInterestForm } from '../../promotions/methodDefinitions';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';
import PromotionService from '../../promotions/server/PromotionService';
import { TASK_TYPES } from '../taskConstants';
import TaskService from './TaskService';

ServerEventService.addAfterMethodListener(
  loanShareSolvency,
  ({ context, params: { shareSolvency, loanId } }) => {
    context.unblock();

    if (shareSolvency) {
      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          title:
            'Contacter le courtier du client pour lui parler de la solvabilité',
        },
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  generateTenDayExpirationReminderTasks,
  ({ result: promotionOptions = [] }) => {
    promotionOptions.forEach(promotionOption => {
      const {
        promotion: { assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          _id: loanId,
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur le lot ${promotionLotName} échoue dans 10 jours, relancer le client`,
          description: `La convention de réservation est valable jusqu'au ${moment(
            expirationDate,
          ).format('DD MMM')}`,
        },
      });
    });
  },
);

ServerEventService.addAfterMethodListener(
  generateExpiringSoonReservationTasks,
  ({ result: promotionOptions = [] }) => {
    promotionOptions.forEach(promotionOption => {
      const {
        promotion: { assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          _id: loanId,
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur le lot ${promotionLotName} arrive à échéance`,
          description: `La convention de réservation est valable jusqu'au ${moment(
            expirationDate,
          ).format('DD MMM')}`,
        },
      });
    });
  },
);

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueOrBorrowRatio,
  ({ params, result: { isRecalculate } }) => {
    const { loanId } = params;
    const {
      hasPromotion,
      user: { name: userName } = {},
      mainAssigneeLink,
    } = LoanService.get(loanId, {
      hasPromotion: 1,
      user: { name: 1 },
      mainAssigneeLink: 1,
    });

    if (hasPromotion && !isRecalculate) {
      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          assigneeLink: { _id: mainAssigneeLink._id },
          title: `Le client ${userName} a effectué un calcul de solvabilité`,
          description:
            "Identifier s'il est nécessaire de le contacter pour valider son attestation préliminaire de financement et s'assurer qu'il ait établi une demande de réservation",
        },
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  generateDisbursedSoonLoansTasks,
  ({ result: disbursedSoonLoanIds = [] }) => {
    disbursedSoonLoanIds.forEach(loanId => {
      const { disbursementDate } = LoanService.get(loanId, {
        disbursementDate: 1,
      });
      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          title: `La date de décaissement du dossier est prévue pour le ${moment(
            disbursementDate,
          ).format('DD.MM.YYYY')}`,
          description: "S'assurer que tout est prêt pour le décaissement",
          type: TASK_TYPES.LOAN_DISBURSED_SOON,
        },
      });
    });
  },
);

ServerEventService.addAfterMethodListener(
  submitPromotionInterestForm,
  ({ params: { details, email, name, phoneNumber, promotionId } }) => {
    const { name: promotionName } = PromotionService.get(promotionId, {
      name: 1,
    });

    TaskService.insert({
      object: {
        collection: PROMOTIONS_COLLECTION,
        docId: promotionId,
        title: `Nouveau client intéressé par ${promotionName}, depuis notre site web`,
        description: `Nom: ${name}\nEmail: ${email}\nTél: ${phoneNumber}\nDétails: ${details}`,
      },
    });
  },
);

ServerEventService.addAfterMethodListener(
  notifyInsuranceTeamForPotential,
  ({ context, params: { loanId } }) => {
    context.unblock();

    TaskService.insert({
      object: {
        collection: LOANS_COLLECTION,
        docId: loanId,
        assigneeLink: { _id: employeesByEmail['jeanluc@e-potek.ch']._id },
        createdBy: context.userId,
        title: 'Valider le potentiel prévoyance identifié sur ce dossier',
      },
    });
  },
);
