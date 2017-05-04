export const getBorrowerMandatoryFiles = b => [
  {
    id: 'identity',
    label: "Pièce d'identité",
    help1: 'Carte d’identité ou Passeport',
  },
  {
    id: 'taxes',
    label: 'Dernière déclaration fiscale',
    // condition: true, //TODO: implement married couple logic
  },
  {
    id: 'salaryChange',
    label: 'Justificatif de nouveau salaire',
    condition: !!b.hasChangedSalary,
  },
];

export const getBorrowerOptionalFiles = b => [
  {
    id: 'salaryCertificate',
    label: 'Certificat de salaire',
  },
  {
    id: 'lastSalaries',
    label: '3 Dernières fiches de salaire',
  },
  {
    id: 'bonus',
    label: 'Justificatif(s) des revenus variables/bonus',
    condition: Object.keys(b.bonus).length > 0,
  },
  {
    label: 'Justificatif(s) des autres revenus',
    id: 'otherIncome',
    condition: b.otherIncome.length > 0,
  },
];
