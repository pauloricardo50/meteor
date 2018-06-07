const employees = [
  {
    email: 'lydia@e-potek.ch',
    src: '/img/team/lydia.jpg',
    name: 'Lydia Abraha',
    title: 'Conseillère en financement',
  },
  {
    email: 'florian@e-potek.ch',
    src: '/img/team/florian.jpg',
    name: 'Florian Bienefelt',
    title: 'CTO',
  },
  {
    email: '',
    src: '/img/team/alexandra.jpg',
    name: 'Alexandra Caldarov',
    title: 'QA Tester',
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
  },
  {
    email: 'jeanluc@e-potek.ch',
    src: '/img/team/jeanluc.jpg',
    name: 'Jean-Luc Kringel',
    title: 'Responsable Assurances',
  },
  {
    email: '',
    src: '/img/team/tarik.jpg',
    name: 'Tarik Lamkarfed',
    title: 'Marketing & Communications',
  },
  {
    email: '',
    src: '/img/team/andra.jpg',
    name: 'Andra Lazariuc',
    title: 'Junior Software Engineer',
  },
  {
    email: '',
    src: '/img/team/harrison.jpg',
    name: 'Harrison Mean',
    title: 'Operations',
  },
  {
    email: '',
    src: '/img/team/claudiu.jpg',
    name: 'Claudiu Teodorescu',
    title: 'Software Engineer',
  },
  {
    email: '',
    src: '/img/team/norbert.jpg',
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
