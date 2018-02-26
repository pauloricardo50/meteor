import { localizationStartup } from 'core/utils/localization';

const setup = () => {
  localizationStartup({ setupAccounts: false });
};

setup();
