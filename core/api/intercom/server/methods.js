import { getIntercomSettings } from '../methodDefinitions';
import IntercomService from './IntercomService';

getIntercomSettings.setHandler(({ userId }) =>
  IntercomService.getIntercomSettings({ userId }),
);
