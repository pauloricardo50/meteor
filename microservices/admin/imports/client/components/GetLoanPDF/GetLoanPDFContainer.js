import fileSaver from 'file-saver';
import { compose, withProps } from 'recompose';

import { generatePDF } from 'core/api/pdf/methodDefinitions';
import { PDF_TYPES } from 'core/api/pdf/pdfConstants';

import { base64ToBlob } from './base64-to-blob';
import { makeGenerateBackgroundInfo } from './helpers';

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

const makeHandlePdf = ({ loan, saveFunc, additionalParams = {} }) => ({
  anonymous,
  ...model
}) => {
  const { organisationId, structureIds } = model;
  const { _id: loanId } = loan;
  const generateBackgroundInfo = makeGenerateBackgroundInfo(loan);

  return generatePDF
    .run({
      type: PDF_TYPES.LOAN,
      params: {
        loanId,
        organisationId,
        structureIds,
        backgroundInfo: generateBackgroundInfo(model),
      },
      options: { anonymous },
      ...additionalParams,
    })
    .then(saveFunc)
    .catch(error => {
      import('../../../core/utils/message').then(({ default: message }) => {
        message.error(error.message, 5);
      });
    });
};

export default compose(
  withProps(({ loan }) => ({
    handlePDF: makeHandlePdf({ loan, saveFunc: savePdf }),
    handleHTML: makeHandlePdf({
      loan,
      saveFunc: saveHtmlFile,
      additionalParams: { htmlOnly: true },
    }),
  })),
);
