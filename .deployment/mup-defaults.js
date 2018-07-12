const createMupConfig = ({ name, path, rootUrl, domain, env }) => {
  const sshPath = 'auth.pem';

  return {
    servers: { one: { host: '167.99.254.87', username: 'root', pem: sshPath } },
    meteor: {
      name,
      path,
      servers: { one: { env: {} } },
      buildOptions: { serverOnly: true },
      env: Object.assign(
        {},
        {
          NODE_ENV: 'production',
          ROOT_URL: rootUrl,
          MONGO_URL:
            'mongodb://admin1:password@aws-eu-central-1-portal.2.dblayer.com:15723,aws-eu-central-1-portal.0.dblayer.com:15723/e-potek?ssl=true',
        },
        env // Make sure to not have a trailing comma in this function call
      ),
      docker: {
        image: 'abernix/meteord:node-8-base',
        stopAppDuringPrepareBundle: false,
        prepareBundle: true,
      },
      enableUploadProgressBar: true,
      deployCheckWaitTime: 120,
    },
    proxy: {
      domains: domain,
      ssl: { letsEncryptEmail: 'florian@e-potek.ch', forceSSL: true },
    },
  };
};

module.exports = createMupConfig;
