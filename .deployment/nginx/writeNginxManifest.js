import { writeYAML } from '../utils/helpers';
import { ENVIRONMENT, APPLICATIONS } from '../settings/config';

const MAINTENANCE_ENV_VARIABLES = {
  [ENVIRONMENT.STAGING]: {
    [APPLICATIONS.APP]: 'MAINTENANCE_STAGING_APP',
    [APPLICATIONS.ADMIN]: 'MAINTENANCE_STAGING_ADMIN',
    [APPLICATIONS.WWW]: 'MAINTENANCE_STAGING_WWW',
  },
  [ENVIRONMENT.PRODUCTION]: {
    [APPLICATIONS.APP]: 'MAINTENANCE_PRODUCTION_APP',
    [APPLICATIONS.ADMIN]: 'MAINTENANCE_PRODUCTION_ADMIN',
    [APPLICATIONS.WWW]: 'MAINTENANCE_PRODUCTION_WWW',
  },
};

const getMaintenanceEnvVariables = ({
  maintenanceEnvironment,
  maintenanceApplications,
}) => ({
  ...Object.values(ENVIRONMENT).reduce(
    (maintenance, env) => ({
      ...maintenance,
      ...Object.keys(MAINTENANCE_ENV_VARIABLES[env]).reduce(
        (maintenanceVariables, key) => ({
          ...maintenanceVariables,
          ...(env === maintenanceEnvironment &&
          maintenanceApplications.includes(key)
            ? { [MAINTENANCE_ENV_VARIABLES[env][key]]: true }
            : {}),
        }),
        {},
      ),
    }),
    {},
  ),
});

const generateNginxManifestData = ({
  maintenanceEnvironment,
  maintenanceApplications,
}) => ({
  applications: [
    {
      name: 'e-potek-nginx',
      memory: '512M',
      instances: 1,
      buildpack: 'https://github.com/cloudfoundry/staticfile-buildpack.git',
      routes: [
        { route: 'app.staging.e-potek.ch' },
        { route: 'admin.staging.e-potek.ch' },
        { route: 'www.staging.e-potek.ch' },
        { route: 'pdf.staging.e-potek.ch' },
        { route: 'pro.staging.e-potek.ch' },
        { route: 'app.e-potek.ch' },
        { route: 'admin.e-potek.ch' },
        { route: 'www.e-potek.ch' },
        { route: 'pdf.e-potek.ch' },
        { route: 'pro.e-potek.ch' },
        { route: 'kadira.e-potek.ch' },
        { route: '*.e-potek.ch' },
        { route: '*.staging.e-potek.ch' },
      ],
      env: {
        FORCE_HTTPS: true,
        ...getMaintenanceEnvVariables({
          maintenanceEnvironment,
          maintenanceApplications,
        }),
      },
    },
  ],
});

export const writeNginxManifest = ({
  maintenanceEnvironment,
  maintenanceApplications,
}) => {
  writeYAML({
    file: `${__dirname}/nginx/manifest.yml`,
    data: generateNginxManifestData({
      maintenanceEnvironment,
      maintenanceApplications,
    }),
  });
};
