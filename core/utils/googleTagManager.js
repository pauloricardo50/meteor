import TagManager from 'react-gtm-module';

const GOOGLE_TAG_MANAGER_ID = 'GTM-W8KXQ9V';

export const initGoogleTagManager = () => {
  console.log(
    'GTAG manager 1',
    process.env.NODE_ENV,
    process.env.NODE_ENV === 'production',
  );
  if (process.env.NODE_ENV === 'production') {
    console.log('GTAG manager 2');
    TagManager.initialize({ gtmId: GOOGLE_TAG_MANAGER_ID });
  }
};

export const dataLayer = () => window?.dataLayer;
