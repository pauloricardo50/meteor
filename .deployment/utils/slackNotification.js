import https from 'https';

const HOST = 'hooks.slack.com';
const PATH = '/services/T94VACASK/BCX1M1JTB/VjrODb3afB1K66BxRIuaYjuV';
const CHANNEL = '#team-engineering';
const OPTIONS = {
  host: HOST,
  port: 443,
  path: PATH,
  method: 'POST',
};

const slackNotification = payload => {
  const body = { channel: CHANNEL, ...payload };
  const req = https.request(OPTIONS, result => {
    result.setEncoding('utf8');
    result.on('data', console.log);
  });

  req.on('error', console.error);

  req.write(JSON.stringify(body));
  req.end();
};

export const slackLogError = ({ error, application }) => {
  const payload = {
    attachments: [
      {
        fallback: 'Echec du déploiement',
        pretext: 'Echec du déploiement',
        color: '#D00000',
        fields: [
          {
            title: 'Application',
            value: application,
            short: false,
          },
          {
            title: 'Raison',
            value: error,
            short: false,
          },
        ],
      },
    ],
  };

  slackNotification(payload);
};

export const slackNotifyAppDeployed = application => {
  const payload = {
    attachments: [
      {
        fallback: 'Déploiement terminé',
        pretext: 'Déploiement terminé',
        color: '#00D000',
        fields: [
          {
            title: 'Application',
            value: application,
            short: false,
          },
        ],
      },
    ],
  };

  slackNotification(payload);
};

const formatApplicationsList = (applications = []) => {
  if (applications.length === 0) {
    return 'Toutes';
  }
  if (applications.length === 1) {
    return applications[0];
  }
  return [
    applications.slice(0, -1).join(', '),
    applications.slice(-1).length ? applications.slice(-1) : null,
  ].join(' et ');
};

export const slackNotifyStartDeployment = ({ applications, environment }) => {
  const payload = {
    attachments: [
      {
        fallback: 'Déploiement en cours',
        pretext: 'Déploiement en cours',
        color: '#0000D0',
        fields: [
          {
            title: 'Environement',
            value: environment,
            short: false,
          },
          {
            title: 'Applications',
            value: formatApplicationsList(applications),
            short: false,
          },
        ],
      },
    ],
  };

  slackNotification(payload);
};

export const slackNotifyAppRestart = application => {
  const payload = {
    attachments: [
      {
        fallback: "Redémarrage de l'application",
        pretext: "Redémarrage de l'application",
        color: '#D0D000',
        fields: [
          {
            title: 'Application',
            value: application,
            short: false,
          },
        ],
      },
    ],
  };

  slackNotification(payload);
};
