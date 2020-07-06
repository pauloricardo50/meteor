import { Font } from '@react-pdf/renderer';

export const assetUrl = 'https://app.e-potek.ch';

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
