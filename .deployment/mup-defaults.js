const createMupConfig = ({ name, path, rootUrl, domain }) => {
  const isCircleCI = !!process.env.CIRCLECI;
  const sshPath = isCircleCI
    ? '~/.ssh/id_rsa_09884ca9b31a641158d6b1776599784b'
    : '~/.ssh/id_rsa';

  console.log('createMupConfig:', isCircleCI, sshPath);

  return {
    servers: {
      one: {
        host: '139.59.211.103',
        username: 'root',
        pem: sshPath,
      },
    },
    meteor: {
      name,
      path,
      servers: {
        one: {
          env: {},
        },
      },
      buildOptions: {
        serverOnly: true,
      },
      env: {
        ROOT_URL: rootUrl,
        MONGO_URL:
          'mongodb://admin1:password@aws-eu-central-1-portal.2.dblayer.com:15723,aws-eu-central-1-portal.0.dblayer.com:15723/e-potek?ssl=true',
      },
      docker: {
        image: 'abernix/meteord:node-8-base',
      },
      enableUploadProgressBar: true,
      deployCheckWaitTime: 120,
    },
    proxy: {
      domains: domain,
      ssl: {
        letsEncryptEmail: 'florian@e-potek.ch',
        forceSSL: true,
      },
    },
  };
};

module.exports = createMupConfig;
