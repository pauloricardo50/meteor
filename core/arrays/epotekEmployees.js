export const EPOTEK_NUMBER = '+41 22 566 01 10';
const employees = [
  {
    email: 'lydia@e-potek.ch',
    src: '/img/team/lydia.jpg',
    name: 'Lydia Abraha',
    title: 'Conseillère en Financement & Prévoyance',
    appTitle: 'Financement & Prévoyance',
    phoneNumber: '+41 22 566 82 92',
    _id: 'LGGMr68iXXtW6bQEx',
    gender: 'F',
    calendly: 'https://calendly.com/epotek-lydia',
  },
  {
    email: 'badr@e-potek.ch',
    src: '/img/team/badr.jpg',
    name: 'Badr Berbar',
    title: 'Head of Business Development',
    phoneNumber: '+41 22 566 01 10',
    _id: 'gxpj4pn2Rzs4trdy9',
    gender: 'M',
  },
  {
    email: 'florian@e-potek.ch',
    src: '/img/team/florian.jpg',
    name: 'Florian Bienefelt',
    title: 'CTO',
    phoneNumber: '+41 22 566 82 91',
    _id: 'CHPzFxTDDekwi4JJP',
    gender: 'M',
  },
  {
    email: 'quentin@e-potek.ch',
    src: '/img/team/quentin.jpg',
    name: 'Quentin Herzig',
    title: 'Software Engineer',
    phoneNumber: EPOTEK_NUMBER,
    _id: 'NJskZ6E38JHfqSyNg',
    gender: 'M',
  },
  {
    email: 'elise@e-potek.ch',
    src: '/img/team/elise.jpg',
    name: 'Élise Juanola',
    title: 'Conseillère en Financement & Prévoyance',
    appTitle: 'Financement & Prévoyance',
    phoneNumber: '+41 22 566 82 98',
    _id: 'gTB7r7E5j5YGiseoF',
    gender: 'F',
    calendly: 'https://calendly.com/epotek-elise',
  },
  {
    email: 'yannis@e-potek.ch',
    src: '/img/team/yannis.jpg',
    name: 'Yannis Eggert',
    title: 'CEO',
    appTitle: 'Financement',
    phoneNumber: '+41 22 566 82 90',
    _id: 'dcXkoTWLZPemu9x9a',
    gender: 'M',
    calendly: 'https://calendly.com/epotek-yannis',
  },
  {
    email: 'jeanluc@e-potek.ch',
    src: '/img/team/jeanluc.jpg',
    name: 'Jean-Luc Kringel',
    title: 'Directeur Banques, Assurances & Prévoyance',
    appTitle: 'Planification & Prévoyance',
    phoneNumber: '+41 22 566 82 94',
    _id: 'efe2jpwvRh8J4z4p8',
    gender: 'M',
    calendly: 'https://calendly.com/epotek-jeanluc',
  },
  {
    email: 'max@e-potek.ch',
    src: '/img/team/max.jpg',
    name: 'Max Martinez',
    title: 'Directeur des Financements et de l’agence de Genève',
    appTitle: 'Financement & Prévoyance',
    phoneNumber: '+41 22 566 82 95',
    _id: 'NumFEubdw2nra6Su8',
    gender: 'M',
    calendly: 'https://calendly.com/epotek-max',
  },
  {
    email: 'patrick@e-potek.ch',
    src: '/img/team/patrick.jpg',
    name: 'Patrick Luongo',
    title: 'Directeur des Financements et de l’agence de Lausanne',
    appTitle: 'Financement & Prévoyance',
    phoneNumber: '+41 21 566 25 24',
    _id: 'RjzusumG8ngdWQ3Jz',
    gender: 'M',
    calendly: 'https://calendly.com/epotek-patrick',
  },
  {
    email: '',
    src: '/img/team/seila.jpg',
    name: 'Seila Rada',
    title: 'Comptabilité & Finance',
    gender: 'F',
  },
  {
    email: 'team@e-potek.ch',
    src: '/img/epotek-logo.png',
    name: 'e-Potek',
    phoneNumber: EPOTEK_NUMBER,
    hideFromTeam: true,
  },
  {
    email: 'corentin@e-potek.ch',
    src: '/img/team/corentin.jpg',
    name: 'Corentin Huard',
    title: 'Head of Product',
    phoneNumber: EPOTEK_NUMBER,
    _id: 'yJS7WaMuJwr8qxpcn',
    gender: 'M',
  },
  {
    email: 'adrien@e-potek.ch',
    src: '/img/team/adrien.jpg',
    name: 'Adrien Sambito',
    title: 'Operations Manager',
    phoneNumber: EPOTEK_NUMBER,
    _id: '4T4PTBrxWFBSKS2jy',
    gender: 'M',
  },
];

export let employeesByEmail;

export let employeesById;

export const setData = () => {
  employeesByEmail = employees.reduce(
    (acc, employee) =>
      employee.email ? { ...acc, [employee.email]: employee } : acc,
    {},
  );

  employeesById = employees.reduce(
    (acc, employee) =>
      employee._id ? { ...acc, [employee._id]: employee } : acc,
    {},
  );
};

setData();

export default employees;
