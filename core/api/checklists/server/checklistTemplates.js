import { CHECKLIST_ITEM_ACCESS } from '../checklistConstants';

const ACQUISITION_TEMPLATE = [
  {
    title: 'Obtention du contrat de crédit',
    items: [
      { title: "Projet d'acte de vente transmis", requiresDocument: true },
      { title: 'Offre ferme obtenue', access: CHECKLIST_ITEM_ACCESS.ADMIN },
      { title: 'Offre ferme acceptée', access: CHECKLIST_ITEM_ACCESS.ADMIN },
      {
        title: 'Mise en relation client/prêteur',
        access: CHECKLIST_ITEM_ACCESS.ADMIN,
      },
      { title: 'Ouverture des comptes' },
      { title: 'Contrat de crédit édité', requiresDocument: true },
      { title: 'Documents et informations essentielles manquantes' },
    ],
  },
  {
    title: 'Déblocage des fonds',
    items: [
      { title: 'Fixation des taux' },
      { title: 'Validation de la date de départ' },
      { title: 'Contrat de crédit signé et retourné', requiresDocument: true },
      {
        title: 'Tous les fonds propres selon la constitution du plan financier',
      },
      { title: 'Toutes les garanties selon la constitution du plan financier' },
      { title: 'Confirmation closing définitif' },
    ],
  },
];

const PROMOTION_ACQUISITION_TEMPLATE = [
  ACQUISITION_TEMPLATE[0],
  {
    title: 'Déblocage des fonds',
    items: [
      { title: 'Fixation des taux' },
      { title: 'Validation de la date de départ' },
      { title: 'Contrat de crédit signé et retourné', requiresDocument: true },
      { title: 'Projet de contrat EG transmis', requiresDocument: true },
      { title: 'Contrat EG signé et retourné', requiresDocument: true },
      {
        title: 'Tous les fonds propres selon la constitution du plan financier',
      },
      { title: 'Toutes les garanties selon la constitution du plan financier' },
      { title: 'Confirmation closing définitif' },
    ],
  },
];

const REFINANCING_TEMPLATE = [
  {
    title: 'Obtention du contrat de crédit',
    items: [
      { title: 'Offre ferme obtenue', access: CHECKLIST_ITEM_ACCESS.ADMIN },
      { title: 'Offre ferme acceptée', access: CHECKLIST_ITEM_ACCESS.ADMIN },
      {
        title: 'Mise en relation client/prêteur',
        access: CHECKLIST_ITEM_ACCESS.ADMIN,
      },
      { title: 'Ouverture des comptes' },
      { title: 'Contrat de crédit édité', requiresDocument: true },
      { title: 'Documents et informations essentielles manquantes' },
    ],
  },
  {
    title: 'Déblocage des fonds',
    items: [
      { title: 'Fixation des taux' },
      { title: 'Validation de la date de départ' },
      { title: 'Contrat de crédit signé et retourné' },
      { title: 'Décompte de remboursement', requiresDocument: true },
      { title: 'Engagement de remise des cédules', requiresDocument: true },
      { title: 'Acte de constitution des cédules', requiresDocument: true },
      {
        title: 'Tous les fonds propres selon la constitution du plan financier',
      },
      { title: 'Toutes les garanties selon la constitution du plan financier' },
      { title: 'Confirmation closing définitif' },
    ],
  },
];

const CHECKLIST_TEMPLATES = {
  ACQUISITION: ACQUISITION_TEMPLATE,
  PROMOTION_ACQUISITION: PROMOTION_ACQUISITION_TEMPLATE,
  REFINANCING: REFINANCING_TEMPLATE,
};

export default CHECKLIST_TEMPLATES;
