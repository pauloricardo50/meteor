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

// If an assignee isn't currently in the list above
export const placeholderEmployee = email => ({
  email,
  src: '/img/placeholder.png',
  name: (() => {
    const emailPrefix = email.split('@')[0];
    return emailPrefix[0].toUpperCase() + emailPrefix.slice(1);
  })(),
  title: undefined,
  phone: undefined,
});

export default employees;
