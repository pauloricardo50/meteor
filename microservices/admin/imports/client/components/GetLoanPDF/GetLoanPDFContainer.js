import fileSaver from 'file-saver';
import { compose, withProps } from 'recompose';

import { PDF_TYPES } from 'core/api/constants';
import { generatePDF } from 'core/api/pdf/methodDefinitions';
import { base64ToBlob } from './base64-to-blob';

const savePdf = ({ base64, pdfName }) => {
  if (!base64) {
    return false;
  }

  try {
    return fileSaver.saveAs(base64ToBlob(base64), `${pdfName}.pdf`);
  } catch (error) {
    import('../../../core/utils/message').then(({ default: message }) => {
      message.error(error.message, 5);
    });
  }
};

const saveHtmlFile = ({ html, pdfName }) => {
  try {
    return fileSaver.saveAs(new Blob([html]), `${pdfName}.html`);
  } catch (error) {
    import('../../../core/utils/message').then(({ default: message }) => {
      message.error(error.message, 5);
    });
  }
};

export default compose(
  withProps(({ loan: { _id: loanId } }) => ({
    handlePDF: ({ anonymous, organisationId, structureIds }) =>
      generatePDF
        .run({
          type: PDF_TYPES.LOAN,
          params: { loanId, organisationId, structureIds },
          options: { anonymous },
        })
        .then(savePdf)
        .catch(error => {
          import('../../../core/utils/message').then(({ default: message }) => {
            message.error(error.message, 5);
          });
        }),
    handleHTML: ({ anonymous, organisationId, structureIds }) =>
      generatePDF
        .run({
          type: PDF_TYPES.LOAN,
          params: { loanId, organisationId, structureIds },
          options: { anonymous },
          htmlOnly: true,
        })
        .then(saveHtmlFile),
  })),
);
