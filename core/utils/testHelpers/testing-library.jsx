import React from 'react';
import * as testingLibrary from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import messages from '../../lang/fr.json';
import { getFormats, getUserLocale } from '../localization';

const locale = getUserLocale();
const formats = getFormats();

const TestProviders = ({ children }) => (
  <IntlProvider
    locale={locale}
    messages={messages}
    formats={formats}
    defaultLocale="fr"
  >
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

const customRender = (ui, options = {}) =>
  testingLibrary.render(ui, { wrapper: TestProviders, ...options });

export * from '@testing-library/react';
export const render = customRender;
