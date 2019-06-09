export const cloudFoundryCommands = {
  selectSpace: space => `cf target -s ${space}`,
  createService: ({ service, plan, serviceInstance }) =>
    `cf create-service ${service} ${plan} ${serviceInstance}`,
  listServices: () => 'cf services',
  listApps: () => 'cf apps',
  push: buildDirectory => `cd ${buildDirectory} && cf push`,
  scale: ({ appName, instances, disk, memory }) => {
    const instancesScale = instances ? `-i ${instances}` : '';
    const diskScale = disk ? `-k ${disk}` : '';
    const memoryScale = memory ? `-m ${memory}` : '';
    return `cf scale ${appName} ${instancesScale} ${diskScale} ${memoryScale}`;
  },
  updateService: ({ serviceInstance, plan }) =>
    `cf update-service ${serviceInstance} -p ${plan}`,
  zeroDownTimePush: (
    { directory, manifest, name }, // For plugin autopilot
  ) => `cf zero-downtime-push ${name} -f ${manifest} -p ${directory}`,
  blueGreenDeploy: ({ buildDirectory, name, manifest }) =>
    `cd ${buildDirectory} && cf blue-green-deploy ${name} -f ${manifest} --smoke-test ./test.sh --delete-old-apps`,
  deleteApp: name => `cf delete ${name} -f`,
  restartApp: name => `cf restart ${name}`,
  deleteOprhanedRoutes: () => 'cf delete-orphaned-routes -f',
  getOauthToken: () => 'cf oauth-token',
};

export const CLOUDFOUNDRY_MARKETPLACE = {
  MONGO_DB: {
    service: 'mongodb-2',
    plans: {
      small: 'small',
      medium: 'medium',
      large: 'large',
    },
  },
  REDIS: {
    service: 'redis-2',
    plans: {
      small: 'small',
      medium: 'medium',
      large: 'large',
      xlarge: 'xlarge',
    },
  },
};

export const CLOUDFOUNDRY_MEMORY_LIMIT = {
  MB64: '64MB',
  MB128: '128MB',
  MB256: '256MB',
  MB512: '512MB',
  MB1024: '1024MB',
  MB1536: '1536MB',
  MB2048: '2048MB',
};

export const CLOUDFOUNDRY_DISK_LIMIT = {
  GB1: '1GB',
  GB2: '2GB',
  GB4: '4GB',
  GB5: '5GB',
  GB6: '6GB',
  GB7: '7GB',
  GB8: '8GB',
};
