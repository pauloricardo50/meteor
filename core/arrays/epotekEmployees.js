const employees = [
  {
    email: 'lydia@e-potek.ch',
    src: '/img/placeholder.png',
    name: 'Lydia Abraha',
    title: 'Conseillère en financement',
  },
  {
    email: 'florian@e-potek.ch',
    src: '/img/placeholder.png',
    name: 'Florian Bienefelt',
    title: 'CTO',
  },
  {
    email: '',
    src: '/img/placeholder.png',
    name: 'Alexandra Caldarov',
    title: 'QA Tester',
  },
  {
    email: '',
    src: '/img/placeholder.png',
    name: 'David Dejean',
    title: 'Design',
  },
  {
    email: 'yannis@e-potek.ch',
    src: '/img/yannis.jpg',
    name: 'Yannis Eggert',
    title: 'Conseiller en financement',
  },
  {
    email: '',
    src: '/img/placeholder.png',
    name: 'Tarik Lamkarfed',
    title: 'Marketing & SEO',
  },
  {
    email: '',
    src: '/img/placeholder.png',
    name: 'Andra Lazariuc',
    title: 'Junior Software Engineer',
  },
  {
    email: '',
    src: '/img/placeholder.png',
    name: 'Harrison Mean',
    title: 'Design',
  },
  {
    email: '',
    src: '/img/placeholder.png',
    name: 'Claudiu Teodorescu',
    title: 'Software Engineer',
  },
  {
    email: '',
    src: '/img/placeholder.png',
    name: 'Norbert Tulbure',
    title: 'Project Manager',
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
