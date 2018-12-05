// @flow
import React from 'react';
import { IntlProvider } from 'react-intl';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../../../lang/fr.json';

type PdfProps = {};

const Pdf = ({ stylesheet, pages }: PdfProps) => (
  <IntlProvider
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    defaultLocale="fr"
  >
    <>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      {pages.map(({ Component, data }, index) => (
        <Component
          {...data}
          pageCount={pages.length}
          pageNb={index + 1}
          key={index}
        />
      ))}
    </>
  </IntlProvider>
);

export default Pdf;
