import fileSaver from 'file-saver';
import { compose, withState, withProps } from 'recompose';

import { PDF_TYPES } from 'core/api/constants';
import { generatePDF } from 'core/api/pdf/methodDefinitions';
import message from 'core/utils/message';
import { base64ToBlob } from './base64-to-blob';

const makeSavePdf = name => (base64) => {
  if (!base64) {
    return false;
  }

  try {
    return fileSaver.saveAs(base64ToBlob(base64), `${name}.pdf`);
  } catch (error) {
    message.error(error.message, 5);
  }
};

const makeSaveHtmlFile = name => (html) => {
  try {
    return fileSaver.saveAs(new Blob([html]), `${name}.html`);
  } catch (error) {
    message.error(error.message, 5);
  }
};

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ setLoading, loan: { name, _id: loanId } }) => ({
    handlePDF: ({ anonymous }) => {
      setLoading(true);
      generatePDF
        .run({
          type: PDF_TYPES.LOAN,
          params: { loanId },
          options: { anonymous },
        })
        .then(makeSavePdf(name))
        .catch(error => message.error(error.message, 5))
        .finally(() => setLoading(false));
    },
    handleHTML: ({ anonymous }) => {
      setLoading(true);
      generatePDF
        .run({
          type: PDF_TYPES.LOAN,
          params: { loanId },
          options: { anonymous },
          htmlOnly: true,
        })
        .then(makeSaveHtmlFile(name))
        .finally(() => setLoading(false));
    },
  })),
);
