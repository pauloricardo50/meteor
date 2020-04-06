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
    title: 'Directeur',
    appTitle: 'Financement',
    phoneNumber: '+41 22 566 82 90',
    _id: 'dcXkoTWLZPemu9x9a',
    gender: 'M',
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
    email: '',
    src: '/img/team/seila.jpg',
    name: 'Seila Rada',
    title: 'Comptabilité & Finance',
    gender: 'F',
  },
];

export const employeesByEmail = employees.reduce(
  (acc, employee) =>
    employee.email ? { ...acc, [employee.email]: employee } : acc,
  {},
);

export const employeesById = employees.reduce(
  (acc, employee) =>
    employee._id ? { ...acc, [employee._id]: employee } : acc,
  {},
);

export default employees;
