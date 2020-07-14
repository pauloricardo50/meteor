import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Manrope-extralight',
  src:
    'https://e-potek-public.s3.eu-central-1.amazonaws.com/Manrope-ExtraLight.ttf',
  fontWeight: 300,
});

Font.register({
  family: 'Manrope-semibold',
  src:
    'https://e-potek-public.s3.eu-central-1.amazonaws.com/Manrope-SemiBold.ttf',
  fontWeight: 600,
});
