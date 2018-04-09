const employees = [
  {
    email: 'yannis@e-potek.ch',
    src: '/img/yannis.jpg',
    name: 'Yannis Eggert',
    title: 'Directeur',
    phone: '022 566 82 90',
  },
  {
    email: 'lydia@e-potek.ch',
    src: '/img/placeholder.png',
    name: 'Lydia Abraha',
    title: 'Conseillère en financement',
    phone: '022 566 82 92',
  },
];

export const placeholderEmployee = email => ({
  email,
  src: '/img/placeholder.png',
  name: email,
  title: '',
  phone: undefined,
});

export default employees;
