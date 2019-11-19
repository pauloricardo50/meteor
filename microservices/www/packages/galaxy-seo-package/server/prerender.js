const prerenderio = (exports.PrerenderIO = require('prerender-node'));

let token;
let serviceUrl;
let protocol;
const settings = Meteor.settings.PrerenderIO;

token = process.env.PRERENDERIO_TOKEN || (settings && settings.token);
protocol = process.env.PRERENDERIO_PROTOCOL || (settings && settings.protocol);

// service url (support `prerenderServiceUrl` (for historical reasons) and `serviceUrl`)
serviceUrl = settings && (settings.prerenderServiceUrl || settings.serviceUrl);
serviceUrl = process.env.PRERENDERIO_SERVICE_URL || serviceUrl;

if (token) {
  if (serviceUrl) prerenderio.set('prerenderServiceUrl', serviceUrl);
  prerenderio.set('prerenderToken', token);
  if (protocol) prerenderio.set('protocol', protocol);

  prerenderio.set('afterRender', function afterRender(error) {
    if (error) {
      console.log('prerenderio error', error); // eslint-disable-line no-console
    }
  });

  WebApp.rawConnectHandlers.use(prerenderio);
}
