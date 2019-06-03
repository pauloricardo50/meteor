const employees = [
  {
    email: 'lydia@e-potek.ch',
    src: '/img/team/lydia.jpg',
    name: 'Lydia Abraha',
    title: 'Conseillère en financement',
    phoneNumber: '+41 22 566 82 92',
  },
  {
    email: 'florian@e-potek.ch',
    src: '/img/team/florian.jpg',
    name: 'Florian Bienefelt',
    title: 'CTO',
    phoneNumber: '+41 22 566 82 91',
  },
  {
    email: 'quentin@e-potek.ch',
    src: '/img/team/quentin.jpg',
    name: 'Quentin Herzig',
    title: 'Software Engineer',
    phoneNumber: '+41 22 566 01 10',
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
  },
  {
    email: 'jeanluc@e-potek.ch',
    src: '/img/team/jeanluc.jpg',
    name: 'Jean-Luc Kringel',
    title: 'Responsable Assurances',
    phoneNumber: '+41 22 566 82 94',
  },
  {
    email: '',
    src: '/img/team/tarik.jpg',
    name: 'Tarik Lamkarfed',
    title: 'Marketing & Communications',
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
  },
];

export const employeesByEmail = employees.reduce(
  (acc, employee) => ({ ...acc, [employee.email]: employee }),
  {},
);

// If an assignee isn't currently in the list above
export const placeholderEmployee = email => ({
  email,
  src: '/img/placeholder.png',
  name: (() => {
    const emailPrefix = email.split('@')[0];
    return emailPrefix[0].toUpperCase() + emailPrefix.slice(1);
  })(),
  title: undefined,
  phoneNumber: undefined,
});

export default employees;
