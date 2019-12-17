import fileSaver from 'file-saver';
import { compose, withProps } from 'recompose';

import { PDF_TYPES } from 'core/api/constants';
import { generatePDF } from 'core/api/pdf/methodDefinitions';
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

export default compose(
  withProps(({ loan }) => {
    const { _id: loanId } = loan;
    const generateBackgroundInfo = makeGenerateBackgroundInfo(loan);

    return {
      handlePDF: ({ anonymous, ...model }) => {
        const { organisationId, structureIds } = model;
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
          })
          .then(savePdf)
          .catch(error => {
            import('../../../core/utils/message').then(
              ({ default: message }) => {
                message.error(error.message, 5);
              },
            );
          });
      },
      handleHTML: ({ anonymous, ...model }) => {
        const { organisationId, structureIds } = model;

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
            htmlOnly: true,
          })
          .then(saveHtmlFile);
      },
    };
  }),
);
