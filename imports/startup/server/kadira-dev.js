import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/meteorhacks:kadira';

if (Meteor.isDevelopment) {
  // Uncomment to use kadira in development, comment to remove unnecessary
  // warnings which say it can't connect like this:
  // GET http://localhost:11011/simplentp/sync net::ERR_CONNECTION_REFUSED
  // Kadira.connect('59LE9xwsTvYugwMZt', 'e247f531-efc2-4e8d-9abb-0e9552ecc710', {
  //   endpoint: 'http://localhost:11011',
  // });
}
