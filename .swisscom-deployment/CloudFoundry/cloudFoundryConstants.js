export const cloudFoundryCommands = {
  selectSpace: space => `cf target -s ${space}`,
  createService: ({ service, plan, serviceInstance }) =>
    `cf create-service ${service} ${plan} ${serviceInstance}`,
  listServices: () => 'cf services',
  push: () => 'cf push',
  scale: ({ appName, instances, disk, memory }) => {
    const instancesScale = !!instances ? `-i ${instances}` : '';
    const diskScale = !!disk ? `-k ${disk}` : '';
    const memoryScale = !!memory ? `-m ${memory}` : '';
    return `cf scale ${appName} ${instancesScale} ${diskScale} ${memoryScale}`;
  },
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
};

export const CLOUDFOUNDRY_MEMORY_LIMIT = {
  MB64: '64MB',
  MB128: '128MB',
  MB256: '256MB',
  MB512: '512MB',
  MB1024: '1024MB',
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
