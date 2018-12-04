import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import fetch from 'node-fetch';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

import { makeCheckObjectStructure } from 'core/utils/checkObjectStructure';
import formatMessage from 'core/utils/intl';
import { PDF_TYPES } from 'core/api/constants';
import { TEMPLATES } from './constants';
import LoanBankPDF from './components/LoanBankPDF';

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
    (parentKey
      ? `Il manque ${formatKey(key)} dans ${formatKey(parentKey)}`
      : `Il manque ${formatKey(key)}`),
  shouldBeArray: key => `${formatKey(key)} doit être une liste`,
  shouldBeObject: key => `${formatKey(key)} doit être un objet`,
  emptyArray: (key, parentKey) =>
    (parentKey
      ? `${formatKey(key)} ne doit pas être vide dans ${formatKey(parentKey)}`
      : `${formatKey(key)} ne doit pas être vide`),
};

class PDFService {
  constructor() {
    this.module = null;
  }

  makeConfigForPDF = ({ type, data, options }) => {
    const fileName = Random.id();

    switch (type) {
    case PDF_TYPES.LOAN:
      return {
        component: LoanBankPDF,
        props: { loan: data, options },
        fileName,
        pdfName: `${data.name} - ${type}`,
      };
    default:
      throw new Meteor.Error(`Invalid pdf type: ${type}`);
    }
  };

  getBase64String = (path) => {
    const file = fs.readFileSync(path);
    fs.unlink(path); // Async delete
    const base64 = new Buffer(file).toString('base64');
    return base64;
  };

  getComponentAsHTML = (component, props) =>
    ReactDOMServer.renderToStaticMarkup(component(props));

  streamToBase64 = (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream
        .on('data', (chunk) => {
          chunks.push(chunk);
        })
        .on('end', () => {
          const blob = Buffer.concat(chunks).toString('base64');
          resolve(blob);
        })
        .on('error', reject);
    });
  };

  generatePDF = (html, fileName, pdfName) => {
    const API_KEY = 'GkjsAcqhD34P070MOF4I';
    const body = {
      user_credentials: API_KEY,
      doc: {
        document_content: html,
        name: pdfName,
        type: 'pdf',
        test: true,
        // test: Meteor.isProduction && !Meteor.isStaging,
        // help: true,
        prince_options: { media: 'screen' },
      },
    };

    return fetch('https://docraptor.com/docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        const dest = fs.createWriteStream(`/tmp/${fileName}.pdf`);
        const stream = res.body.pipe(dest);
        return new Promise((resolve) => {
          stream.on('finish', resolve);
        });
      })
      .then(() => this.getBase64String(`/tmp/${fileName}.pdf`));
  };

  handleGeneratePDF = ({ component, props, fileName, pdfName }, testing) => {
    const html = this.getComponentAsHTML(component, props);
    if (testing) {
      fs.writeFileSync('/tmp/pdf_output.html', html);
    }

    if (html && fileName) {
      return this.generatePDF(html, fileName, pdfName);
    }
  };

  generateContentObject = ({ data, type, options }) => {
    try {
      const checkObjectStructure = makeCheckObjectStructure(frenchErrors);
      checkObjectStructure({
        obj: data,
        template: TEMPLATES[type],
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
    return this.makeConfigForPDF({ data, type, options });
  };

  generateDataAsPDF = ({ data, type, options = {} }, testing = false) => {
    const { HTML } = options;
    const content = this.generateContentObject({ data, type, options });

    if (HTML) {
      const html = this.getComponentAsHTML(content.component, content.props);
      return Promise.resolve(html);
    }

    return this.handleGeneratePDF(content, testing);
  };
}

export default new PDFService();
