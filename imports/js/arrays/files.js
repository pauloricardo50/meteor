import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';

export const borrowerFiles = (b = {}) => ({
  auction: [
    {
      id: 'identity',
      label: "Pièce d'identité",
      help1: "Passeport ou carte d'identité",
    },
    {
      id: 'residencyPermit',
      label: 'Permis d’établissement',
      help1: 'Permis d’établissement pour étrangers mentionnant votre résidence fiscale',
      condition: !b.isSwiss,
    },
    {
      id: 'taxes',
      label: 'Déclaration fiscale',
      help1: 'Dernière disponible, complète et détaillée dans la mesure du possible accompagnée des annexes',
      // condition: true, //TODO: implement married couple logic
    },
    {
      id: 'salaryCertificate',
      label: 'Certificat de salaire',
      help1: 'De l’année précédente - est utilisé pour votre déclaration fiscale',
    },
    {
      id: 'salaryChange',
      label: 'Justificatif du nouveau salaire',
      help1: '3 dernières fiches salaires - une attestation de votre employeur - contrat de travail - avenant à votre contrat de travail',
      condition: !!b.hasChangedSalary,
    },
    {
      id: 'bonus',
      label: 'Justificatif des bonus',
      help1: 'Un justificatif par bonus perçu lors des 4 dernières années',
      condition: !!b.bonus && Object.keys(b.bonus).length > 0,
    },
    {
      id: 'otherIncome',
      label: 'Autres revenus',
      help1: 'Justificatif de chaque autre revenu que vous avez mentionné',
      condition: b.otherIncome && !!(b.otherIncome.length > 0),
    },
    {
      id: 'ownCompanyFinancialStatements',
      label: "États financiers de l'employeur",
      help1: 'Bilans et comptes Pertes et Profits des 3 dernières années',
      condition: !!b.worksForOwnCompany,
    },
    {
      id: 'divorceJudgment',
      label: 'Jugement de divorce',
      condition: !b.civilStatus === 'divorced',
    },
    {
      id: 'expenses',
      label: 'Charges',
      help1: 'Justificatif des charges mentionnées',
      condition: !!b.otherIncome && !!(b.otherIncome.length > 0),
    },
  ],
  contract: [
    {
      id: 'nonPursuitExtract',
      label: "Extrait de l'office des poursuites",
      help1: 'mentionne si vous êtes sujet à des poursuites, avoir des poursuites peut arriver à tout le monde et peuvent parfois s’expliquer',
      help2: 'Vous pouvez commander un extrait de l’office des poursuites sur le site internet ou physiquement au guichet de l’office cantonal de votre canton de résidence actuel. Il doit dater de moins de 3 mois',
    },
    {
      id: 'lastSalaries',
      label: '3 dernières fiches de salaire',
    },
    {
      id: 'currentMortgages',
      label: 'Contrats de prêts existants',
      help1: 'nous avons besoins de connaître le montant de votre prêt hypothécaire existant, le taux d’intérêt et son échéance ainsi que de l‘amortissement annuel y relatif',
      condition: !!b.realEstate && !!b.realEstate.length > 0,
    },
    {
      id: 'bankAssetsChange',
      label: 'Justificatif de fortune bancaire',
      help1: 'Tout document justifiant de votre fortune bancaires (print screen e-banking, relevé mensuel ou annuel)',
      condition: b.fortuneChange,
    },
    {
      id: 'pensionFundYearlyStatement',
      label: 'Certificat de la caisse de pension',
      help1: 'Certificat que vous recevez chaque année de la part de la caisse de pension de votre employeur ou attestation de compte Libre Passage',
      help2: 'Ce document contient le capital prévoyance disponible pour l’accession à la propriété ainsi que différentes informations y relatives, vous devriez recevoir ce document chaque année au mois de janvier si vous ne le trouvez pas vous pouvez le réclamer auprès de votre caisse de pension directement',
      condition: b.insuranceSecondPillar > 0,
    },
    {
      id: 'retirementInsurancePlan',
      label: 'Fortune de prévoyance Assurance',
      help1: 'Document attestant de la valeur de rachat et des primes payées sur vos polices d’assurances 3A et 3B',
      help2: 'Vous pouvez obtenir ces informations auprès des compagnies d’assurances dans lesquels vous effectuez votre épargne de prévoyance',
      condition: b.insuranceThirdPillar > 0, // TODO, separate from insurance and other below
    },
    {
      id: 'retirementPlanOther',
      label: 'Fortune de prévoyance Bancaire',
      help1: 'Relevé au 31/12 de vos compte épargne 3A et/ou comptes libre-passage',
      help2: 'Vous pouvez obtenir les relevés de vos comptes épargne 3A auprès des établissements bancaires dans lesquels vous déposez votre épargne',
      // condition: true, TODO
      condition: false,
    },
  ],
  closing: [],
});

export const requestFiles = (r = {}) => ({
  auction: [
    {
      id: 'plans',
      label: 'Plans',
      help1: 'Vous pouvez obtenir le plan auprès du vendeur ou auprès de la régie, il est préférable d’obtenir un plan avec les métrées',
    },
    {
      id: 'cubage',
      label: 'Cubage',
      help1: 'Peut être mentionné sur la police d’assurance du bâtiment, dans un rapport du BEB ou peut être demandé auprès de votre architecte',
    },
    {
      id: 'pictures',
      label: '4 Photos du bien',
      help1: 'Cuisine, salle de bains, façade extérieure, et vue qui mettent le bien immobilier en valeur',
    },
  ],
  contract: [
    {
      id: 'reimbursementStatement',
      label: 'Décompte de remboursement',
      help1: 'Le décompte de remboursement est produit par votre prêteur actuel',
      condition: !!r.general && r.general.purchaseType === 'refinancing',
    },
    {
      id: 'buyersContract',
      label: "Acte d'achat",
      help1: !!r.general && r.general.purchaseType === 'refinancing'
        ? 'Vous pouvez demander un duplicata auprès du notaire qui était chargé de la signature par le passé'
        : 'Le notaire est chargé de produire un projet d’acte d’achat',
    },
    {
      id: 'rent',
      label: 'Loyers perçus',
      help1: 'loyer versé par le locataire existant ou justificatif du futur loyer',
      help2: "vous pouvez obtenir cette information auprès du vendeur ou auprès de la régie qui va gérer vos locataires, si vous n’avez pas de régie nous vous recommandons de vous informer sur la régie qui s'occupe actuellement de la gestion de l'immeuble",
      condition: !!r.general && r.general.usageType === 'investment',
    },
    {
      id: 'landRegisterExtract',
      label: 'Extrait du registre foncier',
      help1: 'Contient toutes les informations officielles de votre bien immobilier',
      help2: 'Vous pouvez obtenir l’extrait du registre du commerce auprès du registre foncier auquel votre commune est rattachée',
    },
    {
      id: 'marketingBrochure',
      label: 'Brochure de vente',
      condition: !!r.general && r.general.purchaseType === 'acquisition',
      required: false,
    },
    {
      id: 'coownershipAllocationAgreement',
      label: 'Cahier de répartition des locaux',
      help1: 'Document décrivant la pondération de votre lot PPE vis à vis de l’immeuble entier',
      help2: 'Un tiers est nommé comme administrateur de la propriété (souvent une régie) cette entité peut vous fournir ce document',
      condition: !!r.property && !!r.property.isCoproperty,
    },
    {
      id: 'coownershipAgreement',
      label: 'Règlement PPE',
      help1: 'Ce document édicte les règles de vie de la copropriété',
      help2: 'Un tiers est nommé comme administrateur de la propriété (souvent une régie) cette entité peut vous fournir ce document',
      condition: !!r.property && !!r.property.isCoproperty,
    },
    {
      id: 'fireAndWaterInsurance',
      label: 'Assurance incendie et dégâts des eaux',
      help1: 'Vous pouvez obtenir la copie de la police d’assurance existante auprès du vendeur',
      condition: !!(r.property && r.property.isNew),
    },
  ],
  // closing: [
  //   {
  //     id: 'retirementWithdrawalStatement',
  //     label: 'Attestation LPP - après retrait',
  //     help1: 'Certificat émis sur votre demande par votre caisse de pension démontrant votre situation LPP après retrait',
  //     help2: 'Vous pouvez obtenir ce document, sur demande, auprès de votre caisse de pension',
  //     condition: !!r.logic && r.insuranceUsePreset === 'withdrawal',
  //   },
  // ],
});

const getFileIDs = list => {
  let files;
  const ids = [];
  switch (list) {
    case 'borrower':
      files = borrowerFiles();
      break;
    case 'request':
      files = requestFiles();
      break;
    default:
      throw new Error('invalid file list');
  }

  Object.keys(files).forEach(key => files[key].forEach(f => ids.push(f.id)));

  return ids;
};

// Schema used for every file
const FileSchema = new SimpleSchema({
  name: String,
  size: Number,
  type: String,
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  key: String,
  fileCount: Number,
});

// Generates a schema given a list name (request, or borrowers)
export const getFileSchema = list => {
  const schema = {};

  const arr = getFileIDs(list);

  arr.forEach(id => {
    schema[id] = {
      type: Array,
      optional: true,
      maxCount: 100,
    };
    schema[`${id}.$`] = FileSchema;
  });

  return schema;
};

export const fakeFile = {
  name: 'fakeFile.pdf',
  size: 10000,
  type: 'application/pdf',
  url: 'https://www.fake-url.com',
  key: 'asdf/fakeKey/fakeFile.pdf',
  fileCount: 0,
};
