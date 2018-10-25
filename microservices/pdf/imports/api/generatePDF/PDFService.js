import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import ReactDOMServer from 'react-dom/server';
import pdf from 'html-pdf';
import fs from 'fs';

import { makeCheckObjectStructure } from 'core/utils/checkObjectStructure';
import formatMessage from 'core/utils/intl';
import LoanBankPDF from './components/LoanBankPDF';
import { PDF_TYPES, LOAN_BANK_TEMPLATE } from './constants';

const formatKey = (key) => {
  const i18nKey = `Forms.${key}`;
  const translated = formatMessage(`Forms.${key}`);

  if (i18nKey === translated) {
    // Translation does not exist
    return key;
  }

  return translated;
};

const frenchErrors = {
  missingKey: (key, parentKey) =>
    `Il manque ${formatKey(key)} dans ${formatKey(parentKey)}`,
  shouldBeArray: key => `${formatKey(key)} doit être une liste`,
  shouldBeObject: key => `${formatKey(key)} doit être un objet`,
  emptyArray: key => `${formatKey(key)} ne doit pas être vide`,
};

class PDFService {
  constructor() {
    this.module = null;
  }

  getBase64String = (path) => {
    try {
      const file = fs.readFileSync(path);
      return new Buffer(file).toString('base64');
    } catch (exception) {
      this.module.reject(exception);
    }
  };

  getComponentAsHTML = (component, props) => {
    try {
      return ReactDOMServer.renderToStaticMarkup(component(props));
    } catch (exception) {
      this.module.reject(exception);
    }
  };

  generatePDF = (html, fileName) => {
    try {
      pdf
        .create(html, {
          format: 'a4',
          border: {
            top: '2cm',
            right: '1.5cm',
            left: '1.5cm',
            bottom: '2cm',
          },
        })
        .toFile(`./tmp/${fileName}.pdf`, (error, response) => {
          if (error) {
            this.module.reject(error);
          } else {
            this.module.resolve({
              fileName,
              base64: this.getBase64String(response.filename),
            });
            fs.unlink(response.filename);
          }
        });
    } catch (exception) {
      this.module.reject(exception);
    }
  };

  handleGeneratePDF = ({ component, props, fileName }, promise, testing) => {
    this.module = promise;
    const html = this.getComponentAsHTML(component, props);
    if (testing) {
      fs.writeFileSync('/tmp/pdf_output.html', html);
    }

    if (html && fileName) {
      this.generatePDF(html, fileName);
    }
  };

  generateContentObject = ({ data, type, options }) => {
    const fileName = Random.id();
    switch (type) {
    case PDF_TYPES.LOAN_BANK:
      try {
        const checkObjectStructure = makeCheckObjectStructure(frenchErrors);
        checkObjectStructure({
          obj: data.loan,
          template: LOAN_BANK_TEMPLATE,
        });
      } catch (error) {
        throw new Meteor.Error(error);
      }
      return {
        component: LoanBankPDF,
        props: { loan: data.loan, options },
        fileName,
      };

    default:
      return {};
    }
  };

  generateDataAsPDF = ({ data, type, options }, testing = false) => {
    const content = this.generateContentObject({ data, type, options });
    return new Promise((resolve, reject) =>
      this.handleGeneratePDF(content, { resolve, reject }, testing));
  };
}

export default new PDFService();
