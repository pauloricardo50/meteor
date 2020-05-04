import React from 'react';

import { ServerIntlProvider } from '../../../../../utils/server/intl';

export const LastPageContext = React.createContext();

const Pdf = ({ stylesheet, pages, pdfName }) => (
  <ServerIntlProvider>
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
  </ServerIntlProvider>
);

export default Pdf;
