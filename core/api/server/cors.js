import { WebApp } from 'meteor/webapp';

// Allow each microservice to get static resources from each others public folder
WebApp.rawConnectHandlers.use('/public', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'e-potek.ch');
  return next();
});
