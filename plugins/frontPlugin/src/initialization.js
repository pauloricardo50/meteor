const SimpleSchema = require('simpl-schema').default;

SimpleSchema.extendOptions([
  'index',
  'unique',
  'denyInsert',
  'denyUpdate',
  'uniforms',
  'condition',
  'customAllowedValues',
  'customAutoValue',
]);

window.isStaging = window.Front?.endpoint.includes('staging');
window.isProduction =
  !window.isStaging && window.Front?.endpoint.includes('e-potek.ch');

const { isProduction, isStaging } = window;

const SUBDOMAINS = {
  ADMIN: { name: 'admin', port: 5000 },
  APP: { name: 'app', port: 4000 },
  PRO: { name: 'pro', port: 4100 },
  WWW: { name: 'www', port: 4000 },
  BACKEND: { name: 'backend', port: 5500 },
  API: { name: 'api', port: 5500 },
};

window.subdomains = Object.values(SUBDOMAINS).reduce(
  (subdomains, { name, port }) => ({
    ...subdomains,
    [name]:
      isProduction || isStaging
        ? `https://${name}${isStaging ? '.staging' : ''}.e-potek.ch`
        : `http://localhost:${port}`,
  }),
  {},
);
