import TagManager from 'react-gtm-module';

const GOOGLE_TAG_MANAGER_ID = 'GTM-W8KXQ9V';

export const initGoogleTagManager = () => {
  if (process.env.NODE_ENV === 'production') {
    TagManager.initialize({ gtmId: GOOGLE_TAG_MANAGER_ID });
  }
};

export const dataLayer = () => window?.dataLayer;
