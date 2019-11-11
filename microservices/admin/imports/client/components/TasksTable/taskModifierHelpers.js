import moment from 'moment';

const toNearest15Minutes = momentObj => {
  const roundedMinutes = Math.round(momentObj.clone().minute() / 15) * 15;
  return momentObj
    .clone()
    .minute(roundedMinutes)
    .second(0);
};

export const dueAtTimeFuncs = [
  {
    label: 'dans 1h',
    func: () => {
      const nextDate = toNearest15Minutes(moment().add(1, 'h'));
      return [
        ['dueAtTime', nextDate.format('HH:mm')],
        ['dueAt', nextDate.toDate()],
      ];
    },
  },
  {
    label: 'dans 3h',
    func: () => {
      const nextDate = toNearest15Minutes(moment().add(3, 'h'));
      return [
        ['dueAtTime', nextDate.format('HH:mm')],
        ['dueAt', nextDate.toDate()],
      ];
    },
  },
  {
    label: 'Demain, 8h',
    func: () => {
      const nextDate = moment()
        .add(1, 'd')
        .hours(8)
        .minutes(0);

      return [
        ['dueAtTime', nextDate.format('HH:mm')],
        ['dueAt', nextDate.toDate()],
      ];
    },
  },
];

const getNextMonday = () => {
  const dayINeed = 1; // Monday
  const today = moment().isoWeekday();

  // if we haven't yet passed the day of the week that I need:
  if (today < dayINeed) {
    // then just give me this week's instance of that day
    return moment().isoWeekday(dayINeed);
  }
  // otherwise, give me *next week's* instance of that same day
  return moment()
    .add(1, 'weeks')
    .isoWeekday(dayINeed);
};

export const dueAtFuncs = [
  {
    label: 'Demain',
    func: () => [
      [
        'dueAt',
        moment()
          .add(1, 'd')
          .toDate(),
      ],
    ],
  },
  {
    label: 'Dans 3 jours',
    func: () => [
      [
        'dueAt',
        moment()
          .add(3, 'd')
          .toDate(),
      ],
    ],
  },
  {
    label: 'Lundi pro',
    func: () => [['dueAt', getNextMonday().toDate()]],
  },
  {
    label: 'Semaine pro',
    func: () => [
      [
        'dueAt',
        moment()
          .add(7, 'd')
          .toDate(),
      ],
    ],
  },
];
