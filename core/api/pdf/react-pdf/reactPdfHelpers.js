import { Meteor } from 'meteor/meteor';

import { Font } from '@react-pdf/renderer';

const isBackend = Meteor.microservice === 'backend';
console.log('isBackend:', isBackend);
// export const assetUrl = isBackend
//   ? Meteor.settings.public.subdomains.admin
//   : Meteor.settings.public.subdomains[Meteor.microservice];
export const assetUrl = 'https://admin.e-potek.ch';
console.log('assetUrl:', assetUrl);

Font.register({
  family: 'Manrope-extralight',
  src: `${assetUrl}/fonts/Manrope-ExtraLight.ttf`,
  fontWeight: 300,
});
Font.register({
  family: 'Manrope-semibold',
  src: `${assetUrl}/fonts/Manrope-SemiBold.ttf`,
  fontWeight: 600,
});
