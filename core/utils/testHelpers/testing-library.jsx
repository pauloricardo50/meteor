import React from 'react';
import * as testingLibrary from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import messages from '../../lang/fr.json';
import { getFormats, getUserLocale } from '../localization';

const locale = getUserLocale();
const formats = getFormats();

const TestProviders = ({ children, getRouterProps = x => x }) => {
  const routerProps = getRouterProps({ children });
  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      formats={formats}
      defaultLocale="fr"
    >
      <MemoryRouter {...routerProps} />
    </IntlProvider>
  );
};

const customRender = (ui, { getRouterProps, ...options } = {}) =>
  testingLibrary.render(ui, {
    wrapper: props => (
      <TestProviders {...props} getRouterProps={getRouterProps} />
    ),
    ...options,
  });

export { customRender as render };
// Export these like this to avoid weird node issues if you try to do
// export * from '@testing-library/react'; -> Fails
// export { customRender as render };
export {
  waitFor,
  fireEvent,
  screen,
  cleanup,
  within,
} from '@testing-library/react';
