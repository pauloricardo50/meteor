import TagManager from 'react-gtm-module';

const GOOGLE_TAG_MANAGER_ID = 'GTM-W8KXQ9V';

const initGoogleTagManager = () => {
  if (process.env.NODE_ENV === 'production') {
    TagManager.initialize({ gtmId: GOOGLE_TAG_MANAGER_ID });
  }
};

export default initGoogleTagManager;
