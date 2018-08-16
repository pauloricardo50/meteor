export const API_KEY = 'EXOb6cf15325f2b7be02fc37e70';

export const API_SECRET = 'GZu1DwROC_hOOmRaJqrQeryN807VvybQ6KFPlBjxS6A';

export const API_URL = {
  COMPUTE: 'https://api.exoscale.ch/compute?',
};

export const GENEVA_ZONEID = '1128bd56-b4d9-4ac6-a7b9-c715b187ce11';

export const TEMPLATES = {
  UBUNTU_18_04_LTS: {
    DISK_10G: '4c9f5519-730f-46cb-b292-4e73ca578947',
  },
  UBUNTU_16_04_LTS: {
    DISK_10G: '4fedad2b-e96c-4a70-95f7-a9142995dba4',
    DISK_50G: 'ff1d0a36-4df2-4ab0-9081-519f7638ccfa',
    DISK_100G: '922f4a28-eab8-4716-9381-6dce8b106b95',
    DISK_200G: 'bc39cd7b-53ef-4512-ba36-4f9fe7dbd3e6',
    DISK_400G: 'bc226ca2-3fa5-4ec3-a624-b1115cda430a',
  },
  UBUNTU_14_04_LTS: {
    DISK_10G: 'd9b1093f-6988-4b92-8c3a-5a01c8ad167d',
    DISK_50G: '81e9f36d-b1d4-42d5-bb27-d09f18b7d25b',
    DISK_100G: '69e3eea2-77c5-4652-91a7-8c16fe795503',
    DISK_200G: '61fb4dd8-0468-4052-9828-c246c97bbe43',
    DISK_400G: 'da8b65e8-fba9-4e7a-b33d-b05361bb8e36',
  },
};

export const SERVICE_OFFERINGS = {
  MICRO: {
    id: '71004023-bb72-4a97-b1e9-bc66dfce9470',
    description: 'Micro 512mb 1cpu',
    cpunumber: 1,
    cpuspeed: 2198,
    memory: 512,
  },

  TINY: {
    id: 'b6cd1ff5-3a2f-4e9d-a4d1-8988c1191fe8',
    description: 'Tiny 1024mb 1cpu',
    cpunumber: 1,
    cpuspeed: 2198,
    memory: 1024,
  },

  SMALL: {
    id: '21624abb-764e-4def-81d7-9fc54b5957fb',
    description: 'Small 2048mb 2cpu',
    cpunumber: 2,
    cpuspeed: 2198,
    memory: 2048,
  },

  MEDIUM: {
    id: 'b6e9d1e8-89fc-4db3-aaa4-9b4c5b1d0844',
    description: 'Medium 4096mb 2cpu',
    cpunumber: 2,
    cpuspeed: 2198,
    memory: 4096,
  },

  LARGE: {
    id: 'c6f99499-7f59-4138-9427-a09db13af2bc',
    description: 'Large 8192mb 4cpu',
    cpunumber: 4,
    cpuspeed: 2198,
    memory: 8192,
  },

  EXTRA_LARGE: {
    id: '350dc5ea-fe6d-42ba-b6c0-efb8b75617ad',
    description: 'Extra-large 16384mb 4cpu',
    cpunumber: 4,
    cpuspeed: 2198,
    memory: 16384,
  },

  HUGE: {
    id: 'a216b0d1-370f-4e21-a0eb-3dfc6302b564',
    description: 'Huge 32768mb 8cpu',
    cpunumber: 8,
    cpuspeed: 2198,
    memory: 32768,
  },

  MEGA: {
    id: 'c0d3fb5d-6fdb-4a63-9361-3e5cfa8b36d0',
    description: 'Mega 64gb 12cpu',
    cpunumber: 12,
    cpuspeed: 2198,
    memory: 65536,
  },

  TITAN: {
    id: '74bfaf4e-7d67-4adf-9322-12b9a36e84f7',
    description: 'Titan 128gb 16cpu',
    cpunumber: 16,
    cpuspeed: 2198,
    memory: 131072,
  },

  GPU_SMALL: {
    id: '07246b95-bbe4-498f-92a3-ce5be4d38342',
    description: 'GPU small 1gpu 60gb 12cpu',
    cpunumber: 12,
    cpuspeed: 2198,
    memory: 57344,
  },

  GPU_HUGE: {
    id: 'dee65287-12cf-4e36-b635-32dbc9a2e909',
    description: 'GPU huge 4gpu 240gb 48cpu',
    cpunumber: 48,
    cpuspeed: 2198,
    memory: 230400,
  },

  STORAGE_SMALL: {
    id: 'e67871c5-5fb5-4406-b5c9-e1b196d8b02c',
    description: 'Storage-small',
    cpunumber: 2,
    cpuspeed: 1500,
    memory: 6144,
  },
};

export const VIRTUAL_MACHINES = {
  UBUNTU_18_04_LTS_DISK_50G_MEMORY_4096MB_2CPU: {
    serviceofferingid: SERVICE_OFFERINGS.MEDIUM.id,
    templateid: TEMPLATES.UBUNTU_18_04_LTS.DISK_10G,
    rootdisksize: '50',
    zoneid: GENEVA_ZONEID,
    keyboard: 'fr-ch',
  },
};

export const FIREWALL = {
  INGRESS: {
    SSH: {
      description: 'SSH',
      protocol: 'TCP',
      cidrList: '0.0.0.0/0',
      startPort: 22,
      endPort: 22,
    },
    PING: {
      description: 'PING',
      protocol: 'ICMP',
      cidrList: '0.0.0.0/0',
      icmpType: 8,
      icmpCode: 0,
    },
    HTTP: {
      description: 'WWW',
      protocol: 'TCP',
      cidrList: '0.0.0.0/0',
      startPort: 80,
      endPort: 80,
    },
    HTTPS: {
      description: 'HTTPS',
      protocol: 'TCP',
      cidrList: '0.0.0.0/0',
      startPort: 443,
      endPort: 443,
    },
  },
};

export const ASSOCIATED_IP_ADRESSES = {
  ADDRESS1: {
    id: '19a9a40c-b355-40f7-85b7-5e7757a04e2c',
    address: '89.145.167.85',
  },
  ADDRESS2: {
    id: '356102ec-48f9-45d2-a5e1-c8ffad2bb5f1',
    address: '89.145.167.186',
  },
  ADDRESS3: {
    id: '3923a548-802d-456a-b37e-86cef7800b74',
    address: '89.145.166.25',
  },
  ADDRESS4: {
    id: '576dfbf6-3053-4f58-8295-bf5b064cc564',
    address: '89.145.166.147',
  },
  ADDRESS5: {
    id: '877b38eb-b5b2-433a-adb3-b597f05edfd6',
    address: '89.145.166.118',
  },
};
