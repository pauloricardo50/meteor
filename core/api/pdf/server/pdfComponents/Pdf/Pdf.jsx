//
import React from 'react';
import { IntlProvider } from 'react-intl';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../../../lang/fr.json';

export const LastPageContext = React.createContext();

const Pdf = ({ stylesheet, pages, pdfName }) => (
  <IntlProvider
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    defaultLocale="fr"
  >
    <>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      {pdfName && <title>{pdfName}</title>}
      {pages.map(({ Component, data, id }, index, arr) => {
        const isLast = index === arr.length - 1;

        return (
          <LastPageContext.Provider key={id} value={isLast}>
            <Component {...data} pageCount={pages.length} pageNb={index + 1} />
          </LastPageContext.Provider>
        );
      })}
    </>
  </IntlProvider>
);

export default Pdf;
