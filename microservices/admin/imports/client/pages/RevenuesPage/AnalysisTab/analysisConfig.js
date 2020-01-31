import {
  LOANS_COLLECTION,
  REVENUES_COLLECTION,
  USERS_COLLECTION,
  LOAN_STATUS_ORDER,
  BORROWERS_COLLECTION,
  REVENUE_STATUS,
  ACTIVITIES_COLLECTION,
  TASKS_COLLECTION,
  ACTIVITY_TYPES,
} from 'core/api/constants';

const makeFormatDate = key => ({ [key]: date }) =>
  date && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}`;

const analysisConfig = {
  [LOANS_COLLECTION]: {
    category: { id: 'Forms.category' },
    status: {
      id: 'Forms.status',
      format: ({ status }) =>
        `${LOAN_STATUS_ORDER.indexOf(status) + 1}. ${status}`,
    },
    residenceType: { id: 'Forms.residenceType' },
    'user.roles': { id: 'Forms.roles' },
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
    'structure.wantedLoan': { id: 'Forms.wantedLoan' },
    revenues: [
      {
        id: 'collections.revenues',
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
    ],
  },
  [REVENUES_COLLECTION]: {
    amount: { id: 'Forms.amount' },
    type: { id: 'Forms.type' },
    secondaryType: { id: 'Forms.secondaryType' },
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
        fragment: { category: 1, status: 1 },
        format: ({ loan }) => loan && loan.category,
      },
      {
        label: 'Statut du dossier',
        format: ({ loan: { status } = {} }) =>
          status
            ? `${LOAN_STATUS_ORDER.indexOf(status) + 1}. ${status}`
            : undefined,
      },
    ],
  },
  [USERS_COLLECTION]: {
    roles: { id: 'Forms.roles' },
    'referredByOrganisation.name': { id: 'Forms.referredBy' },
    createdAt: {
      label: 'Création Mois-Année',
      format: makeFormatDate('createdAt'),
    },
    'assignedEmployee.name': { label: 'Conseiller' },
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
    ],
    loan: [
      {
        label: 'Conseiller du dossier',
        fragment: { category: 1, assignees: { name: 1 } },
        format: ({ loan: { assignees = [] } = {} }) =>
          assignees.length
            ? assignees.find(({ $metadata }) => $metadata.isMain).name
            : undefined,
      },
      {
        label: 'Catégorie du dossier',
        format: ({ loan }) => loan?.category,
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
};

export default analysisConfig;
