import get from 'lodash/get';
import moment from 'moment';

import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from 'core/api/activities/activityConstants';
import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { INSURANCE_PRODUCT_FEATURES } from 'core/api/insuranceProducts/insuranceProductConstants';
import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
  UNSUCCESSFUL_INSURANCE_REQUESTS_REASONS,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import {
  INSURANCES_COLLECTION,
  INSURANCE_STATUS_ORDER,
} from 'core/api/insurances/insuranceConstants';
import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
  UNSUCCESSFUL_LOAN_REASONS,
} from 'core/api/loans/loanConstants';
import { OFFERS_COLLECTION } from 'core/api/offers/offerConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import {
  REVENUES_COLLECTION,
  REVENUE_STATUS,
} from 'core/api/revenues/revenueConstants';
import { TASKS_COLLECTION } from 'core/api/tasks/taskConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { employeesById } from 'core/arrays/epotekEmployees';
import intl from 'core/utils/intl';

const { formatMessage } = intl;

const makeFormatDate = path => object => {
  const date = get(object, path);
  return (
    date &&
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}`
  );
};
const sevenDaysAgo = moment().day(-7).hour(0).minute(0);

const fifteenDaysAgo = moment().day(-15).hour(0).minute(0);

const thirtyDaysAgo = moment().day(-30).hour(0).minute(0);

const analysisConfig = {
  [LOANS_COLLECTION]: {
    category: { id: 'Forms.category', formsFormat: true },
    status: {
      id: 'Forms.status',
      format: ({ status }) =>
        `${LOAN_STATUS_ORDER.indexOf(status) + 1}) ${formatMessage({
          id: `Forms.status.${status}`,
        })}`,
    },
    residenceType: { id: 'Forms.residenceType', formsFormat: true },
    purchaseType: {
      id: 'Forms.purchaseType',
      format: ({ purchaseType, promotions }) => {
        if (promotions?.length) {
          return 'Acquisition Promo';
        }

        return purchaseType;
      },
    },
    user: [
      {
        id: 'Forms.roles',
        fragment: {
          assignedRoles: 1,
          referredByOrganisation: { name: 1 },
          emails: 1,
          acquisitionChannel: 1,
        },
        format: ({ user }) =>
          user?.assignedRoles?.map(role =>
            formatMessage({ id: `roles.${role}` }),
          ),
      },
      {
        label: 'Référé par',
        format: ({ user }) => user?.referredByOrganisation?.name,
      },
      {
        label: 'Compte vérifié',
        format: ({ user }) =>
          user?.emails?.some(({ verified }) => verified) ? 'Oui' : 'Non',
      },
      {
        label: 'A un compte',
        format: ({ user }) => (user ? 'Oui' : 'Non'),
      },
      {
        label: "Canal d'acquisition",
        format: ({ user }) =>
          user?.acquisitionChannel &&
          formatMessage({
            id: `Forms.acquisitionChannel.${user?.acquisitionChannel}`,
          }),
      },
    ],
    createdAt: [
      {
        label: 'Création Mois-Année',
        format: makeFormatDate('createdAt'),
      },
      {
        label: 'Création Année',
        format: ({ createdAt }) => createdAt && createdAt.getFullYear(),
      },
      {
        label: 'Créé < 7 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(sevenDaysAgo) ? 'Oui' : 'Non',
      },
      {
        label: 'Créé < 15 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(fifteenDaysAgo) ? 'Oui' : 'Non',
      },
      {
        label: 'Créé < 30 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(thirtyDaysAgo) ? 'Oui' : 'Non',
      },
    ],
    anonymous: {
      id: 'Forms.anonymous',
      format: ({ anonymous }) => (anonymous ? 'Oui' : 'Non'),
    },
    assignees: [
      {
        fragment: { name: 1 },
        label: 'Conseiller principal',
        format: ({ assignees }) => {
          if (!assignees || assignees.length === 0) {
            return 'Personne';
          }

          return assignees.find(({ $metadata }) => $metadata.isMain).name;
        },
      },
      {
        label: 'Nb. de conseillers',
        format: ({ assignees = [] }) => assignees.length,
      },
    ],
    structureCache: {
      fragment: { wantedLoan: 1, offerId: 1 },
      id: 'Forms.wantedLoan',
      format: ({ structureCache }) => structureCache?.wantedLoan,
    },
    revenues: [
      {
        label: 'Revenus totaux',
        fragment: { amount: 1, status: 1, organisationLinks: 1 },
        format: ({ revenues = [] }) =>
          revenues.reduce((t, { amount }) => t + amount, 0),
      },
      {
        label: 'Revenus totaux - commissions',
        format: ({ revenues = [] }) =>
          revenues.reduce((t, { amount, organisationLinks = [] }) => {
            const totalCommission = organisationLinks.reduce(
              (tot, { commissionRate }) => tot + commissionRate,
              0,
            );

            return t + amount * (1 - totalCommission);
          }, 0),
      },
      {
        label: 'Revenus encaissés',
        format: ({ revenues = [] }) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.CLOSED)
            .reduce((t, { amount }) => t + amount, 0),
      },
      {
        label: 'Revenus encaissés - commissions',
        format: ({ revenues = [] }) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.CLOSED)
            .reduce((t, { amount, organisationLinks = [] }) => {
              const totalCommission = organisationLinks.reduce(
                (tot, { commissionRate }) => tot + commissionRate,
                0,
              );

              return t + amount * (1 - totalCommission);
            }, 0),
      },
      {
        label: 'Revenus projetés',
        format: ({ revenues = [] }) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.EXPECTED)
            .reduce((t, { amount }) => t + amount, 0),
      },
    ],
    promotions: [
      {
        fragment: { name: 1 },
        label: 'Promotion',
        format: ({ promotions = [] }) => {
          const [promotion] = promotions;
          if (!promotion) {
            return 'Aucune';
          }

          return promotion.name;
        },
      },
    ],
    lendersCache: {
      label: "Nb. d'offres reçues",
      format: ({ lendersCache = [] }) =>
        lendersCache.reduce(
          (t, { offersCache = [] }) => t + offersCache.length,
          0,
        ),
    },
    lenders: {
      fragment: { organisation: { name: 1 }, offersCache: 1 },
      label: 'Prêteur retenu',
      format: ({ structureCache, lenders }) => {
        const offerSelected = structureCache?.offerId;

        if (offerSelected) {
          const lender = lenders.find(({ offersCache = [] }) =>
            offersCache.find(({ _id }) => _id === offerSelected),
          );
          return lender?.organisation?.name;
        }
      },
    },
    activities: [
      {
        fragment: {
          metadata: { event: 1, details: { nextStatus: 1 } },
          date: 1,
          details: 1,
          $options: { sort: { date: -1 } },
        },
        label: 'Dernier changement de statut',
        format: ({ activities = [] }) => {
          const lastChangedStatus = activities.find(
            ({ metadata }) =>
              metadata?.event === ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
          );
          return lastChangedStatus && makeFormatDate('date')(lastChangedStatus);
        },
      },
      {
        label: 'Passage à finalisé',
        format: ({ activities, status }) => {
          if (status !== LOAN_STATUS.FINALIZED) {
            return;
          }

          const finalizedActivity = activities.find(
            ({ metadata }) =>
              metadata?.event === ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS &&
              metadata?.details?.nextStatus === LOAN_STATUS.FINALIZED,
          );
          return finalizedActivity && makeFormatDate('date')(finalizedActivity);
        },
      },
      {
        label: 'Passage à facturation',
        format: ({ activities, status }) => {
          if (![LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED].includes(status)) {
            return;
          }
          const finalizedActivity = activities.find(
            ({ metadata }) =>
              metadata?.event === ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS &&
              metadata?.details?.nextStatus === LOAN_STATUS.BILLING,
          );
          return finalizedActivity && makeFormatDate('date')(finalizedActivity);
        },
      },
      {
        label: 'Semaines avant facturation',
        format: ({ activities, createdAt }) => {
          const finalizedActivity = activities.find(
            ({ metadata }) =>
              metadata?.event === ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS &&
              metadata?.details?.nextStatus === LOAN_STATUS.BILLING,
          );

          return finalizedActivity
            ? moment(finalizedActivity.date).diff(createdAt, 'weeks')
            : undefined;
        },
      },
      {
        label: 'Semaines avant sans-suite',
        format: ({ activities, createdAt }) => {
          const unsuccessfulActivity = activities.find(
            ({ metadata }) =>
              metadata?.event === ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS &&
              metadata?.details?.nextStatus === LOAN_STATUS.UNSUCCESSFUL,
          );

          return unsuccessfulActivity
            ? moment(unsuccessfulActivity.date).diff(createdAt, 'weeks')
            : undefined;
        },
      },
    ],
    unsuccessfulReason: {
      label: "Raison d'archivage",
      format: ({ unsuccessfulReason }) =>
        unsuccessfulReason
          ? Object.values(UNSUCCESSFUL_LOAN_REASONS).includes(
              unsuccessfulReason,
            )
            ? formatMessage({
                id: `Forms.unsuccessfulReason.${unsuccessfulReason}`,
              })
            : 'Autre'
          : undefined,
    },
    insuranceRequests: {
      fragment: { status: 1 },
      label: 'A un dossier assurance valide',
      format: ({ insuranceRequests = [] }) =>
        insuranceRequests.some(
          ({ status }) => status !== INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
        )
          ? 'Oui'
          : 'Non',
    },
  },
  [REVENUES_COLLECTION]: {
    amount: [
      { id: 'Forms.amount' },
      {
        label: 'Montant net de commissions',
        format: ({ amount, organisations }) => {
          const commission = organisations.reduce(
            (t, { $metadata: { commissionRate } }) => t + commissionRate,
            0,
          );
          return amount * (1 - commission);
        },
      },
    ],
    type: { id: 'Forms.type', formsFormat: true },
    status: { id: 'Forms.status', formsFormat: true },
    'sourceOrganisation.name': { id: 'Forms.sourceOrganisationLink' },
    paidAt: {
      label: 'Payé Mois-Année',
      format: makeFormatDate('paidAt'),
    },
    expectedAt: {
      label: 'Attendu Mois-Année',
      format: makeFormatDate('expectedAt'),
    },
    'assignee.name': { label: 'Responsable' },
    organisations: [
      {
        fragment: { name: 1 },
        label: 'Commission %',
        format: ({ organisations = [] }) =>
          organisations.reduce(
            (t, { $metadata: { commissionRate } }) => t + commissionRate,
            0,
          ),
      },
      {
        label: 'Commission payée à',
        format: ({ organisations = [] }) =>
          organisations.map(({ name }) => name),
      },
      {
        label: 'Commission à payer',
        format: ({ organisations = [], amount }) =>
          organisations.reduce(
            (t, { $metadata: { commissionRate } }) =>
              t + commissionRate * amount,
            0,
          ),
      },
    ],
    loan: [
      {
        label: 'Catégorie du dossier',
        fragment: {
          category: 1,
          status: 1,
          promotions: { name: 1 },
          user: {
            referredByOrganisation: { name: 1 },
            acquisitionChannel: 1,
          },
          purchaseType: 1,
        },
        format: ({ loan }) =>
          loan?.category &&
          formatMessage({ id: `Forms.category.${loan.category}` }),
      },
      {
        label: 'Statut du dossier',
        format: ({ loan: { status } = {} }) =>
          status
            ? `${LOAN_STATUS_ORDER.indexOf(status) + 1}) ${status}`
            : undefined,
      },
      {
        label: 'Promotion',
        format: ({ loan: { promotions = [] } = {} }) => {
          const [promotion] = promotions;
          if (!promotion) {
            return 'Aucune';
          }

          return promotion.name;
        },
      },
      {
        label: 'Référé par',
        format: ({ loan }) => loan?.user?.referredByOrganisation?.name,
      },
      {
        label: 'Type du dossier',
        format: ({ loan }) =>
          loan?.purchaseType &&
          formatMessage({ id: `Forms.purchaseType.${loan.purchaseType}` }),
      },
      {
        label: "Canal d'acquisition",
        format: ({ loan }) =>
          loan?.user?.acquisitionChannel &&
          formatMessage({
            id: `Forms.acquisitionChannel.${loan.user.acquisitionChannel}`,
          }),
      },
    ],
  },
  [USERS_COLLECTION]: {
    name: {
      label: 'Nom',
    },
    emails: {
      label: 'Email vérifié',
      format: ({ emails = [] }) =>
        emails.some(({ verified }) => verified) ? 'Oui' : 'Non',
    },
    assignedRoles: {
      id: 'Forms.roles',
      format: ({ assignedRoles }) =>
        assignedRoles.map(role => formatMessage({ id: `roles.${role}` })),
    },
    'referredByOrganisation.name': { id: 'Forms.referredBy' },
    'referredByUser.name': { label: 'Référé par compte' },
    createdAt: {
      label: 'Création Mois-Année',
      format: makeFormatDate('createdAt'),
    },
    'assignedEmployee.name': { label: 'Conseiller' },
    acquisitionChannel: { id: 'Forms.acquisitionChannel', formsFormat: true },
    loans: {
      fragment: { _id: 1 },
      label: 'Nb. de dossiers',
      format: ({ loans = [] }) => loans.length,
    },
  },
  [BORROWERS_COLLECTION]: {
    age: { id: 'Forms.age' },
    gender: { id: 'Forms.gender', formsFormat: true },
    isSwiss: {
      id: 'Forms.isSwiss',
      format: ({ isSwiss }) => (isSwiss ? 'Oui' : 'Non'),
    },
    civilStatus: { id: 'Forms.civilStatus', formsFormat: true },
    createdAt: {
      label: 'Création Mois-Année',
      format: makeFormatDate('createdAt'),
    },
    netSalary: { id: 'Forms.netSalary' },
    salary: { id: 'Forms.salary' },
  },
  [ACTIVITIES_COLLECTION]: {
    fragment: {
      loan: { status: 1 },
      insuranceRequest: { status: 1 },
      insurance: { status: 1 },
    },
    createdByUser: {
      fragment: { name: 1 },
      label: 'Créé par',
      format: ({ createdByUser }) => createdByUser?.name,
    },
    type: { id: 'Forms.type', formsFormat: true },
    date: { id: 'Forms.date', format: makeFormatDate('date') },
    metadata: [
      {
        label: "Type d'événement",
        format: ({ type, metadata }) =>
          type === ACTIVITY_TYPES.EVENT ? metadata.event : undefined,
      },
      {
        label: 'Changement de statut',
        format: ({ metadata }) => {
          const nextStatus = metadata?.details?.nextStatus;

          if (!nextStatus) {
            return;
          }

          if (INSURANCE_STATUS_ORDER.includes(nextStatus)) {
            return `${
              INSURANCE_STATUS_ORDER.indexOf(nextStatus) + 1
            }) ${formatMessage({ id: `Forms.status.${nextStatus}` })}`;
          }

          return `${
            LOAN_STATUS_ORDER.indexOf(nextStatus) + 1
          }) ${formatMessage({ id: `Forms.status.${nextStatus}` })}`;
        },
      },
    ],
    loan: [
      {
        label: 'Conseiller du dossier',
        fragment: {
          category: 1,
          assignees: { name: 1 },
          structureCache: { wantedLoan: 1 },
          purchaseType: 1,
        },
        format: ({ loan: { assignees = [] } = {} }) =>
          assignees.length
            ? assignees.find(({ $metadata }) => $metadata.isMain).name
            : undefined,
      },
      {
        label: 'Catégorie du dossier',
        format: ({ loan }) =>
          loan?.category &&
          formatMessage({ id: `Forms.category.${loan.category}` }),
      },
      {
        label: 'Type du dossier',
        format: ({ loan }) =>
          loan?.purchaseType &&
          formatMessage({ id: `Forms.purchaseType.${loan.purchaseType}` }),
      },
      {
        id: 'Forms.wantedLoan',
        format: ({ loan }) => loan?.structureCache?.wantedLoan,
      },
    ],
    relatedTo: {
      label: 'Lié à',
      format: ({ loan, insuranceRequest, insurance }) => {
        if (loan?._id) {
          return 'Hypothèque';
        }
        if (insuranceRequest?._id) {
          return 'Dossier assurance';
        }
        if (insurance) {
          return 'Assurance';
        }
      },
    },
    createdAt: {
      label: 'Création Mois-Année',
      format: makeFormatDate('createdAt'),
    },
    isTest: {
      label: 'Test?',
      format: ({ loan, insuranceRequest }) =>
        loan?.status === LOAN_STATUS.TEST ||
        insuranceRequest?.status === INSURANCE_REQUEST_STATUS.TEST,
    },
  },
  [TASKS_COLLECTION]: {
    createdAt: {
      label: 'Création Mois-Année',
      format: makeFormatDate('createdAt'),
    },
    updatedAt: {
      label: 'Mis à jour Mois-Année',
      format: makeFormatDate('updatedAt'),
    },
    dueAt: {
      label: 'Échéance Mois-Année',
      format: makeFormatDate('dueAt'),
    },
    status: { id: 'Forms.status', formsFormat: true },
    assignee: {
      fragment: { name: 1 },
      id: 'Forms.assignedTo',
      format: ({ assignee }) => assignee?.name,
    },
    createdBy: {
      label: 'Créé par',
      format: ({ createdBy }) => {
        const employee = employeesById[createdBy];
        return employee?.name;
      },
    },
    completedAt: [
      {
        label: 'Complété Mois-Année',
        format: makeFormatDate('completedAt'),
      },
      {
        label: "Heures entre complété et date d'échéance",
        format: ({ completedAt, dueAt }) => {
          if (!completedAt || !dueAt) {
            return;
          }

          const delta = moment(completedAt).diff(dueAt, 'hours');

          if (Math.abs(delta) > 60 * 24) {
            return;
          }

          return delta;
        },
      },
      {
        label: 'Heures entre complété et créé',
        format: ({ completedAt, createdAt }) => {
          if (!completedAt) {
            return;
          }

          const delta = moment(completedAt).diff(createdAt, 'hours');

          if (Math.abs(delta) > 60 * 24) {
            return;
          }

          return delta;
        },
      },
    ],
  },
  [ORGANISATIONS_COLLECTION]: {
    name: { id: 'Forms.name' },
    type: { id: 'Forms.type', formsFormat: true },
    features: { id: 'Forms.features', formsFormat: true },
    userLinks: {
      label: 'Nb. de comptes',
      format: ({ userLinks = [] }) => userLinks.length,
    },
    referredUsersCount: { label: 'Nb. de clients référés' },
    commissionRate: { label: 'Taux de commissionnement actuel' },
    generatedRevenues: { label: 'Revenus générés' },
    lenders: [
      {
        fragment: {
          offers: { maxAmount: 1 },
          loan: { structureCache: { offerId: 1 } },
        },
        label: 'Offres faites',
        format: ({ lenders = [] }) =>
          lenders.reduce((t, { offers = [] }) => t + offers.length, 0),
      },
      {
        label: 'Offres retenues',
        format: ({ lenders = [] }) =>
          lenders.reduce((t, { offers = [], loan }) => {
            const chosenOffer = loan?.structureCache?.offerId
              ? offers
                  .map(({ _id }) => _id)
                  .includes(loan.structureCache.offerId)
              : false;
            return chosenOffer ? t + 1 : t;
          }, 0),
      },
      {
        label: "Volume d'offres faites",
        format: ({ lenders = [] }) =>
          lenders.reduce((t, { offers = [] }) => {
            const amounts = offers.map(({ maxAmount = 0 }) => maxAmount);
            const maxOfferMade = Math.max(0, ...amounts);
            return t + maxOfferMade;
          }, 0),
      },
    ],
  },
  [INSURANCE_REQUESTS_COLLECTION]: {
    status: {
      id: 'Forms.status',
      format: ({ status }) =>
        `${
          INSURANCE_REQUEST_STATUS_ORDER.indexOf(status) + 1
        }) ${formatMessage({ id: `Forms.status.${status}` })}`,
    },
    user: [
      {
        id: 'Forms.roles',
        fragment: {
          assignedRoles: 1,
          referredByOrganisation: { name: 1 },
          emails: 1,
        },
        format: ({ user }) =>
          user?.assignedRoles?.map(role =>
            formatMessage({ id: `roles.${role}` }),
          ),
      },
      {
        label: 'Référé par',
        format: ({ user }) => user?.referredByOrganisation?.name,
      },
      {
        label: 'Compte vérifié',
        format: ({ user }) =>
          user?.emails?.some(({ verified }) => verified) ? 'Oui' : 'Non',
      },
      {
        label: 'A un compte',
        format: ({ user }) => (user ? 'Oui' : 'Non'),
      },
    ],
    createdAt: [
      {
        label: 'Création Mois-Année',
        format: makeFormatDate('createdAt'),
      },
      {
        label: 'Création Année',
        format: ({ createdAt }) => createdAt && createdAt.getFullYear(),
      },
      {
        label: 'Créé < 7 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(sevenDaysAgo) ? 'Oui' : 'Non',
      },
      {
        label: 'Créé < 15 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(fifteenDaysAgo) ? 'Oui' : 'Non',
      },
      {
        label: 'Créé < 30 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(thirtyDaysAgo) ? 'Oui' : 'Non',
      },
    ],
    assignees: [
      {
        fragment: { name: 1 },
        label: 'Conseiller principal',
        format: ({ assignees }) => {
          if (!assignees || assignees.length === 0) {
            return 'Personne';
          }

          return assignees.find(({ $metadata }) => $metadata.isMain).name;
        },
      },
      {
        label: 'Nb. de conseillers',
        format: ({ assignees = [] }) => assignees.length,
      },
    ],
    activities: [
      {
        fragment: {
          type: 1,
          metadata: { event: 1, details: 1 },
          date: 1,
          $options: { sort: { date: -1 } },
        },
        label: 'Dernier changement de statut',
        format: ({ activities = [] }) => {
          const lastChangedStatus = activities.find(
            ({ metadata }) =>
              metadata?.event ===
              ACTIVITY_EVENT_METADATA.INSURANCE_REQUEST_CHANGE_STATUS,
          );
          return lastChangedStatus && makeFormatDate('date')(lastChangedStatus);
        },
      },
      {
        label: 'Planification faite < 7 jours',
        format: ({ activities = [] }) => {
          const financialPlanningDone = activities.find(
            ({ type, date }) =>
              type === ACTIVITY_TYPES.FINANCIAL_PLANNING &&
              moment(date).isAfter(sevenDaysAgo),
          );

          return financialPlanningDone ? 'Oui' : 'Non';
        },
      },
      {
        label: 'Planification faite < 15 jours',
        format: ({ activities = [] }) => {
          const financialPlanningDone = activities.find(
            ({ type, date }) =>
              type === ACTIVITY_TYPES.FINANCIAL_PLANNING &&
              moment(date).isAfter(fifteenDaysAgo),
          );

          return financialPlanningDone ? 'Oui' : 'Non';
        },
      },
      {
        label: 'Passage à finalisé',
        format: ({ activities }) => {
          const finalizedActivity = activities.find(
            ({ metadata }) =>
              metadata?.event ===
                ACTIVITY_EVENT_METADATA.INSURANCE_REQUEST_CHANGE_STATUS &&
              metadata?.details?.nextStatus ===
                INSURANCE_REQUEST_STATUS.FINALIZED,
          );
          return finalizedActivity && makeFormatDate('date')(finalizedActivity);
        },
      },
      {
        label: 'Passage à facturation',
        format: ({ activities }) => {
          const finalizedActivity = activities.find(
            ({ metadata }) =>
              metadata?.event ===
                ACTIVITY_EVENT_METADATA.INSURANCE_REQUEST_CHANGE_STATUS &&
              metadata?.details?.nextStatus ===
                INSURANCE_REQUEST_STATUS.BILLING,
          );
          return finalizedActivity && makeFormatDate('date')(finalizedActivity);
        },
      },
    ],
    revenues: [
      {
        label: 'Revenus totaux',
        fragment: { amount: 1, status: 1 },
        format: ({ revenues = [] }) =>
          revenues.reduce((t, { amount }) => t + amount, 0),
      },
      {
        label: 'Revenus encaissés',
        format: ({ revenues = [] }) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.CLOSED)
            .reduce((t, { amount }) => t + amount, 0),
      },
      {
        label: 'Revenus projetés',
        format: ({ revenues = [] }) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.EXPECTED)
            .reduce((t, { amount }) => t + amount, 0),
      },
    ],
    unsuccessfulReason: {
      label: "Raison d'archivage",
      format: ({ unsuccessfulReason }) =>
        unsuccessfulReason
          ? Object.values(UNSUCCESSFUL_INSURANCE_REQUESTS_REASONS).includes(
              unsuccessfulReason,
            )
            ? formatMessage({
                id: `Forms.unsuccessfulReason.${unsuccessfulReason}`,
              })
            : 'Autre'
          : undefined,
    },
  },
  [INSURANCES_COLLECTION]: {
    status: {
      id: 'Forms.status',
      format: ({ status }) => formatMessage({ id: `Forms.status.${status}` }),
    },
    insuranceRequest: [
      {
        id: 'Forms.roles',
        fragment: {
          assignees: { name: 1 },
          user: {
            assignedRoles: 1,
            referredByOrganisation: { name: 1 },
            emails: 1,
          },
        },
        format: ({ insuranceRequest: { user } = {} }) =>
          user?.assignedRoles?.map(role =>
            formatMessage({ id: `roles.${role}` }),
          ),
      },
      {
        label: 'Référé par',
        format: ({ insuranceRequest: { user } = {} }) =>
          user?.referredByOrganisation?.name,
      },
      {
        label: 'Compte vérifié',
        format: ({ insuranceRequest: { user } = {} }) =>
          user?.emails?.some(({ verified }) => verified) ? 'Oui' : 'Non',
      },
      {
        label: 'A un compte',
        format: ({ insuranceRequest: { user } = {} }) => (user ? 'Oui' : 'Non'),
      },
      {
        label: 'Conseiller principal',
        format: ({ insuranceRequest: { assignees } = {} }) => {
          if (!assignees || assignees.length === 0) {
            return 'Personne';
          }

          return assignees.find(({ $metadata }) => $metadata.isMain).name;
        },
      },
    ],
    createdAt: [
      {
        label: 'Création Mois-Année',
        format: makeFormatDate('createdAt'),
      },
      {
        label: 'Création Année',
        format: ({ createdAt }) => createdAt && createdAt.getFullYear(),
      },
      {
        label: 'Créé < 7 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(sevenDaysAgo) ? 'Oui' : 'Non',
      },
      {
        label: 'Créé < 15 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(fifteenDaysAgo) ? 'Oui' : 'Non',
      },
      {
        label: 'Créé < 30 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(thirtyDaysAgo) ? 'Oui' : 'Non',
      },
    ],
    revenues: [
      {
        label: 'Revenus totaux',
        fragment: { amount: 1, status: 1 },
        format: ({ revenues = [] }) =>
          revenues.reduce((t, { amount }) => t + amount, 0),
      },
      {
        label: 'Revenus encaissés',
        format: ({ revenues = [] }) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.CLOSED)
            .reduce((t, { amount }) => t + amount, 0),
      },
      {
        label: 'Revenus projetés',
        format: ({ revenues = [] }) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.EXPECTED)
            .reduce((t, { amount }) => t + amount, 0),
      },
    ],
    activities: [
      {
        fragment: {
          type: 1,
          metadata: { event: 1 },
          date: 1,
          $options: { sort: { date: -1 } },
        },
        label: 'Dernier changement de statut',
        format: ({ activities = [] }) => {
          const lastChangedStatus = activities.find(
            ({ metadata }) =>
              metadata?.event ===
              ACTIVITY_EVENT_METADATA.INSURANCE_CHANGE_STATUS,
          );
          return lastChangedStatus && makeFormatDate('date')(lastChangedStatus);
        },
      },
      {
        label: 'Rendez-vous fait < 7 jours',
        format: ({ activities = [] }) => {
          const meetingDone = activities.find(
            ({ type, date }) =>
              type === ACTIVITY_TYPES.MEETING &&
              moment(date).isAfter(sevenDaysAgo),
          );

          return meetingDone ? 'Oui' : 'Non';
        },
      },
      {
        label: 'Rendez-vous fait < 15 jours',
        format: ({ activities = [] }) => {
          const meetingDone = activities.find(
            ({ type, date }) =>
              type === ACTIVITY_TYPES.MEETING &&
              moment(date).isAfter(fifteenDaysAgo),
          );

          return meetingDone ? 'Oui' : 'Non';
        },
      },
    ],
    borrower: {
      label: 'Âge',
      fragment: { age: 1 },
      format: ({ borrower }) => borrower?.age,
    },
    organisation: {
      label: 'Assureur',
      fragment: { name: 1 },
      format: ({ organisation }) => organisation?.name,
    },
    insuranceProduct: [
      {
        label: 'Produit',
        fragment: {
          name: 1,
          category: 1,
          features: 1,
        },
        format: ({ insuranceProduct }) => insuranceProduct?.name,
      },
      {
        label: 'Catégorie',
        format: ({ insuranceProduct }) =>
          formatMessage({
            id: `insuranceProduct.category.${insuranceProduct?.category}`,
          }),
      },
      {
        label: 'Avec capital garanti',
        format: ({ insuranceProduct: { features = [] } } = {}) =>
          features.includes(INSURANCE_PRODUCT_FEATURES.GUARANTEED_CAPITAL)
            ? 'Oui'
            : 'Non',
      },
      {
        label: 'Avec capital non garanti',
        format: ({ insuranceProduct: { features = [] } } = {}) =>
          features.includes(INSURANCE_PRODUCT_FEATURES.NON_GUARANTEED_CAPITAL)
            ? 'Oui'
            : 'Non',
      },
      {
        label: 'Avec capital décès',
        format: ({ insuranceProduct: { features = [] } } = {}) =>
          features.includes(INSURANCE_PRODUCT_FEATURES.DEATH_CAPITAL)
            ? 'Oui'
            : 'Non',
      },
      {
        label: "Avec rente d'incapacité de gain",
        format: ({ insuranceProduct: { features = [] } } = {}) =>
          features.includes(INSURANCE_PRODUCT_FEATURES.DISABILITY_PENSION)
            ? 'Oui'
            : 'Non',
      },
    ],
    premium: { id: 'Forms.premium' },
    premiumFrequency: {
      id: 'Forms.premiumFrequency',
      format: ({ premiumFrequency }) =>
        formatMessage({ id: `Forms.premiumFrequency.${premiumFrequency}` }),
    },
    guaranteedCapital: { id: 'Forms.guaranteedCapital' },
    nonGuaranteedCapital: { id: 'Forms.nonGuaranteedCapital' },
    deathCapital: { id: 'Forms.deathCapital' },
    disabilityPension: { id: 'Forms.disabilityPension' },
  },
  [OFFERS_COLLECTION]: {
    createdAt: [
      {
        label: 'Création Mois-Année',
        format: makeFormatDate('createdAt'),
      },
      {
        label: 'Création Année',
        format: ({ createdAt }) => createdAt && createdAt.getFullYear(),
      },
    ],
    withCounterparts: {
      id: 'Forms.withCounterparts',
      format: ({ withCounterParts }) => (withCounterParts ? 'Oui' : 'Non'),
    },
    feedback: [
      { label: 'Feedback envoyé', format: ({ feedback }) => !!feedback?.date },
      { label: 'Date du feedback', format: makeFormatDate('feedback.date') },
    ],
    lender: [
      {
        label: 'Prêteur',
        fragment: {
          status: 1,
          organisation: { name: 1 },
          contact: { name: 1 },
          loan: { structureCache: { offerId: 1 } },
        },
        format: ({ lender: { organisation } }) => organisation?.name,
      },
      {
        label: 'Contact',
        format: ({ lender: { contact } }) => contact?.name,
      },
      {
        id: 'Forms.status',
        format: ({ lender: { status } }) =>
          formatMessage({ id: `Forms.status.${status}` }),
      },
      {
        label: 'Choisi',
        format: ({ _id: offerId, lender: { loan } }) =>
          loan?.structureCache?.offerId === offerId ? 'Oui' : 'Non',
      },
    ],
  },
};

export default analysisConfig;
