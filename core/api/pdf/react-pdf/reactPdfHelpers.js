import { Meteor } from 'meteor/meteor';

import { Font } from '@react-pdf/renderer';

const isBackend = Meteor.microservice === 'backend';
export const assetUrl = isBackend
  ? Meteor.settings.public.subdomains.admin
  : Meteor.settings.public.subdomains[Meteor.microservice];

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
