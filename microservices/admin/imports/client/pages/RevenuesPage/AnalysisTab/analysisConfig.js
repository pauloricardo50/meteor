import moment from 'moment';

import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from 'core/api/activities/activityConstants';
import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import {
  LOANS_COLLECTION,
  LOAN_STATUS_ORDER,
} from 'core/api/loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import {
  REVENUES_COLLECTION,
  REVENUE_STATUS,
} from 'core/api/revenues/revenueConstants';
import { TASKS_COLLECTION } from 'core/api/tasks/taskConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';

const makeFormatDate = key => ({ [key]: date }) =>
  date && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}`;

const sevenDaysAgo = moment()
  .day(-7)
  .hour(0)
  .minute(0);

const thirtyDaysAgo = moment()
  .day(-30)
  .hour(0)
  .minute(0);

const analysisConfig = {
  [LOANS_COLLECTION]: {
    category: { id: 'Forms.category' },
    status: {
      id: 'Forms.status',
      format: ({ status }) =>
        `${LOAN_STATUS_ORDER.indexOf(status) + 1}. ${status}`,
    },
    residenceType: { id: 'Forms.residenceType' },
    purchaseType: { id: 'Forms.purchaseType' },
    user: [
      {
        id: 'Forms.roles',
        fragment: { roles: 1, referredByOrganisation: { name: 1 }, emails: 1 },
        format: ({ user }) => user?.roles,
      },
      {
        id: 'Référé par',
        format: ({ user }) => user?.referredByOrganisation?.name,
      },
      {
        id: 'Compte vérifié',
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
        label: 'Créé < 30 jours',
        format: ({ createdAt }) =>
          moment(createdAt).isAfter(thirtyDaysAgo) ? 'Oui' : 'Non',
      },
    ],
    anonymous: { id: 'Forms.anonymous' },
    assignees: [
      {
        fragment: { name: 1 },
        label: 'Conseiller',
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
        id: 'Revenus totaux',
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
    activities: {
      fragment: {
        metadata: { event: 1 },
        date: 1,
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
  },
  [REVENUES_COLLECTION]: {
    amount: { id: 'Forms.amount' },
    type: { id: 'Forms.type' },
    status: { id: 'Forms.status' },
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
          },
          purchaseType: 1,
        },
        format: ({ loan }) => loan && loan.category,
      },
      {
        label: 'Statut du dossier',
        format: ({ loan: { status } = {} }) =>
          status
            ? `${LOAN_STATUS_ORDER.indexOf(status) + 1}. ${status}`
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
        id: 'Référé par',
        format: ({ loan }) => loan?.user?.referredByOrganisation?.name,
      },
      {
        id: 'Type du dossier',
        format: ({ loan }) => loan?.purchaseType,
      },
    ],
  },
  [USERS_COLLECTION]: {
    emails: {
      label: 'Email vérifié',
      format: ({ emails }) =>
        emails.some(({ verified }) => verified) ? 'Oui' : 'Non',
    },
    roles: { id: 'Forms.roles' },
    'referredByOrganisation.name': { id: 'Forms.referredBy' },
    'referredByUser.name': { label: 'Référé par compte' },
    createdAt: {
      label: 'Création Mois-Année',
      format: makeFormatDate('createdAt'),
    },
    'assignedEmployee.name': { label: 'Conseiller' },
    acquisitionChannel: { id: 'Forms.acquisitionChannel' },
    loans: {
      fragment: { _id: 1 },
      label: 'Nb. de dossiers',
      format: ({ loans = [] }) => loans.length,
    },
  },
  [BORROWERS_COLLECTION]: {
    age: { id: 'Forms.age' },
    gender: { id: 'Forms.gender' },
    isSwiss: { id: 'Forms.isSwiss' },
    civilStatus: { id: 'Forms.civilStatus' },
    createdAt: {
      label: 'Création Mois-Année',
      format: makeFormatDate('createdAt'),
    },
    netSalary: { id: 'Forms.netSalary' },
    salary: { id: 'Forms.salary' },
  },
  [ACTIVITIES_COLLECTION]: {
    createdByUser: {
      fragment: { name: 1 },
      label: 'Créé par',
      format: ({ createdByUser }) => createdByUser?.name,
    },
    type: { id: 'Forms.type' },
    date: { id: 'Forms.date', format: makeFormatDate('date') },
    metadata: [
      {
        label: "Type d'événement",
        format: ({ type, metadata }) =>
          type === ACTIVITY_TYPES.EVENT ? metadata.event : undefined,
      },
      {
        label: 'Changement de statut',
        format: ({ metadata }) => metadata?.details?.nextStatus,
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
        format: ({ loan }) => loan?.category,
      },
      {
        label: 'Type du dossier',
        format: ({ loan }) => loan?.purchaseType,
      },
      {
        id: 'Forms.wantedLoan',
        format: ({ loan }) => loan?.structureCache?.wantedLoan,
      },
    ],
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
    status: { id: 'Forms.status' },
    assignee: {
      fragment: { name: 1 },
      id: 'Forms.assignedTo',
      format: ({ assignee }) => assignee?.name,
    },
  },
  [ORGANISATIONS_COLLECTION]: {
    name: {
      id: 'Forms.name',
    },
    type: {
      id: 'Forms.type',
    },
    features: {
      id: 'Forms.features',
    },
    userLinks: {
      label: 'Nb. de comptes',
      format: ({ userLinks = [] }) => userLinks.length,
    },
    referredUsersCount: {
      label: 'Nb. de clients référés',
    },
    commissionRate: {
      label: 'Taux de commissionnement actuel',
    },
    generatedRevenues: {
      label: 'Revenus générés',
    },
    lenders: [
      {
        fragment: {
          offers: { maxAmount: 1 },
          loan: {
            structureCache: { offerId: 1 },
          },
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
};

export default analysisConfig;
