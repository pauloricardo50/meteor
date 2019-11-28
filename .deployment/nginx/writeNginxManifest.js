import { writeYAML } from '../utils/helpers';
import { ENVIRONMENT, APPLICATIONS } from '../settings/config';

const MAINTENANCE_ENV_VARIABLES = {
  [ENVIRONMENT.STAGING]: {
    [APPLICATIONS.APP]: 'MAINTENANCE_STAGING_APP',
    [APPLICATIONS.ADMIN]: 'MAINTENANCE_STAGING_ADMIN',
    [APPLICATIONS.WWW]: 'MAINTENANCE_STAGING_WWW',
    [APPLICATIONS.PRO]: 'MAINTENANCE_STAGING_PRO',
    [APPLICATIONS.BACKEND]: 'MAINTENANCE_STAGING_PRO',
  },
  [ENVIRONMENT.PRODUCTION]: {
    [APPLICATIONS.APP]: 'MAINTENANCE_PRODUCTION_APP',
    [APPLICATIONS.ADMIN]: 'MAINTENANCE_PRODUCTION_ADMIN',
    [APPLICATIONS.WWW]: 'MAINTENANCE_PRODUCTION_WWW',
    [APPLICATIONS.PRO]: 'MAINTENANCE_PRODUCTION_PRO',
    [APPLICATIONS.BACKEND]: 'MAINTENANCE_PRODUCTION_PRO',
  },
  [ENVIRONMENT.DEV]: {
    [APPLICATIONS.APP]: 'MAINTENANCE_DEV_APP',
    [APPLICATIONS.ADMIN]: 'MAINTENANCE_DEV_ADMIN',
    [APPLICATIONS.WWW]: 'MAINTENANCE_DEV_WWW',
    [APPLICATIONS.PRO]: 'MAINTENANCE_DEV_PRO',
    [APPLICATIONS.BACKEND]: 'MAINTENANCE_DEV_PRO',
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
        // Production
        { route: '*.e-potek.ch' },
        { route: 'admin.e-potek.ch' },
        { route: 'app.e-potek.ch' },
        { route: 'backend.e-potek.ch' },
        { route: 'pro.e-potek.ch' },
        { route: 'www.e-potek.ch' },
        { route: 'kadira.e-potek.ch' },
        { route: 'api.e-potek.ch' },

        // Staging
        { route: '*.staging.e-potek.ch' },
        { route: 'admin.staging.e-potek.ch' },
        { route: 'app.staging.e-potek.ch' },
        { route: 'backend.staging.e-potek.ch' },
        { route: 'pro.staging.e-potek.ch' },
        { route: 'www.staging.e-potek.ch' },
        { route: 'api.staging.e-potek.ch' },

        // Dev
        { route: '*.dev.e-potek.ch' },
        { route: 'admin.dev.e-potek.ch' },
        { route: 'app.dev.e-potek.ch' },
        { route: 'backend.dev.e-potek.ch' },
        { route: 'pro.dev.e-potek.ch' },
        { route: 'www.dev.e-potek.ch' },
        { route: 'api.dev.e-potek.ch' },
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
