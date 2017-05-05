export const borrowerFiles = (b = {}) => ({
  auction: [
    {
      id: 'identity',
      label: "Pièce d'identité",
      help1: 'Carte d’identité ou Passeport',
    },
    {
      id: 'residencyPermit',
      label: 'Permis d’établissement',
      help1: 'Permis d’établissement pour étrangers mentionnant votre résidence fiscale',
      condition: !b.isSwiss,
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
    {
      id: 'otherIncome',
      label: 'Justificatif des autres revenus',
      condition: b.otherIncome && !!(b.otherIncome.length > 0),
    },
    {
      id: 'ownCompanyFinancialStatements',
      label: "États financiers de l'employeur",
      condition: !!b.worksForOwnCompany,
    },
    {
      id: 'divorceJudgment',
      label: 'Jugement de divorce',
      condition: !b.civilStatus === 'divorced',
    },
  ],
  contract: [],

  closing: [],
});

export const getFileIDs = list => {
  let files;
  let ids;
  switch (list) {
    case 'borrower':
      files = borrowerFiles();
      break;
    // case 'request':
    //   files = requestFiles;
    //   break;
    default:
      throw new Error('invalid file list');
  }

  Object.keys(files).forEach(key => files[key].forEach(f => ids.push(f.id)));

  return ids;
};
