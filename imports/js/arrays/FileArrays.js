export const getBorrowerMandatoryFiles = b => [
  {
    title: "Document d'identité",
    id: 'identity',
  },
  {
    title: 'Dernière déclaration fiscale',
    id: 'taxes',
  },
  {
    title: 'Justificatif de nouveau salaire',
    id: 'salaryChange',
    condition: !!b.hasChangedSalary,
  },
];

export const getBorrowerOptionalFiles = b => [
  {
    title: 'Certificat de salaire',
    id: 'salaryCertificate',
  },
  {
    title: '3 Dernières fiches de salaire',
    id: 'lastSalaries',
  },
  {
    title: 'Justificatif(s) des revenus variables/bonus',
    id: 'bonus',
    condition: Object.keys(b.bonus).length > 0,
  },
  {
    title: 'Justificatif(s) des autres revenus',
    id: 'otherIncome',
    condition: b.otherIncome.length > 0,
  },
];
