import { CHECKLIST_ITEM_ACCESS } from '../checklistConstants';

const ACQUISITION_TEMPLATE = [
  {
    title: 'Obtention du contrat de crédit',
    items: [
      {
        title: "Projet d'acte de vente transmis",
        description:
          "Demandez le projet d'acte au notaire et transmettez le à votre conseiller",
        requiresDocument: true,
      },
      {
        title: 'Offre ferme obtenue',
        description: "Réactualiser l'offre si besoin",
        access: CHECKLIST_ITEM_ACCESS.ADMIN,
      },
      {
        title: 'Offre ferme acceptée',
        description: 'Par le client',
        access: CHECKLIST_ITEM_ACCESS.ADMIN,
      },
      {
        title: 'Client mis en relation avec le prêteur',
        access: CHECKLIST_ITEM_ACCESS.ADMIN,
      },
      {
        title: 'Comptes bancaires ouverts',
        description: 'Ouvrez vos nouveaux comptes chez votre prêteur',
      },
      {
        title: 'Contrat de crédit édité',
        description: 'Demandez le contrat à votre conseiller',
        requiresDocument: true,
      },
      {
        title: 'Dossier complet',
        description:
          "Finissez de renseigner vos informations et d'uploader vos documents",
      },
    ],
  },
  {
    title: 'Déblocage des fonds',
    items: [
      {
        title: 'Contrat de crédit signé et retourné',
        description:
          'Signez et transmettez votre contrat à votre prêteur et à votre conseiller',
        requiresDocument: true,
      },
      {
        title: 'Acte de nantissement signé',
        description: 'Pour les nantissements prévus dans votre plan financier',
      },
      {
        title: 'Date de décaissement validée',
        description: 'La date à laquelle votre prêt débutera',
      },
      {
        title: 'Taux fixés',
        description: 'Obtenez les taux définitifs de votre prêt',
      },
      {
        title: 'Fonds propres versés',
        description:
          'Faites les démarches auprès des caisses de pension/assurances en cas de retrait',
      },
    ],
  },
];

const PROMOTION_ACQUISITION_TEMPLATE = [
  ACQUISITION_TEMPLATE[0],
  {
    ...ACQUISITION_TEMPLATE[1],
    items: [
      ...ACQUISITION_TEMPLATE[1].items.slice(0, 4),
      {
        title: 'Projet de contrat EG transmis',
        description: "Demandez le contrat à l'entreprise générale",
        requiresDocument: true,
      },
      {
        title: 'Contrat EG signé et retourné',
        description:
          "Signez et transmettez votre contrat à l'entreprise générale et à votre conseiller",
        requiresDocument: true,
      },
      ...ACQUISITION_TEMPLATE[1].items.slice(-1),
    ],
  },
];

const REFINANCING_TEMPLATE = [
  {
    ...ACQUISITION_TEMPLATE[0],
    items: [...ACQUISITION_TEMPLATE[0].items.slice(1)],
  },
  {
    title: 'Déblocage des fonds',
    items: [
      ...ACQUISITION_TEMPLATE[1].items.slice(0, 4),
      {
        title: 'Décompte de remboursement transmis',
        description: 'Demandez ce document à votre prêteur actuel',
        requiresDocument: true,
      },
      {
        title: 'Engagement de remise des cédules transmis',
        description: 'Demandez ce document à votre prêteur actuel',
        requiresDocument: true,
      },
      ...ACQUISITION_TEMPLATE[1].items.slice(-1),
    ],
  },
];

const CHECKLIST_TEMPLATES = {
  ACQUISITION: ACQUISITION_TEMPLATE,
  PROMOTION_ACQUISITION: PROMOTION_ACQUISITION_TEMPLATE,
  REFINANCING: REFINANCING_TEMPLATE,
};

export default CHECKLIST_TEMPLATES;
