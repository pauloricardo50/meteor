const employees = [
  {
    email: 'lydia@e-potek.ch',
    src: '/img/team/lydia.jpg',
    name: 'Lydia Abraha',
    title: 'Conseillère en financement',
    phoneNumber: '+41 22 566 82 92',
    _id: 'LGGMr68iXXtW6bQEx',
  },
  {
    email: 'florian@e-potek.ch',
    src: '/img/team/florian.jpg',
    name: 'Florian Bienefelt',
    title: 'CTO',
    phoneNumber: '+41 22 566 82 91',
    _id: 'CHPzFxTDDekwi4JJP',
  },
  {
    email: 'quentin@e-potek.ch',
    src: '/img/team/quentin.jpg',
    name: 'Quentin Herzig',
    title: 'Software Engineer',
    phoneNumber: '+41 22 566 01 10',
    _id: 'NJskZ6E38JHfqSyNg',
  },
  {
    email: '',
    src: '/img/team/david.jpg',
    name: 'David Dejean',
    title: 'Designer',
  },
  {
    email: 'yannis@e-potek.ch',
    src: '/img/team/yannis.jpg',
    name: 'Yannis Eggert',
    title: 'Conseiller en financement',
    phoneNumber: '+41 22 566 82 90',
    _id: 'dcXkoTWLZPemu9x9a',
  },
  {
    email: 'jeanluc@e-potek.ch',
    src: '/img/team/jeanluc.jpg',
    name: 'Jean-Luc Kringel',
    title: 'Responsable Assurances',
    phoneNumber: '+41 22 566 82 94',
    _id: 'efe2jpwvRh8J4z4p8',
  },
  {
    email: '',
    src: '/img/team/tarik.jpg',
    name: 'Tarik Lamkarfed',
    title: 'Marketing & Communications',
  },
  {
    email: 'max@e-potek.ch',
    src: '/img/team/max.jpg',
    name: 'Max Martinez',
    title: 'Conseiller en financement',
    phoneNumber: '+41 22 566 82 95',
    _id: 'NumFEubdw2nra6Su8',
  },
  {
    email: '',
    src: '/img/team/harrison.jpg',
    name: 'Harrison Mean',
    title: 'Operations',
  },
  {
    email: 'yann@e-potek.ch',
    src: '/img/team/yann.jpg',
    name: 'Yann Roy',
    title: 'UX/UI Designer',
    phoneNumber: '+41 22 566 01 10',
    _id: 'nySgkgGNoRAaAoZvE',
  },
];

export const employeesByEmail = employees.reduce(
  (acc, employee) =>
    (employee.email ? { ...acc, [employee.email]: employee } : acc),
  {},
);
export const employeesById = employees.reduce(
  (acc, employee) =>
    (employee._id ? { ...acc, [employee._id]: employee } : acc),
  {},
);

export default employees;
