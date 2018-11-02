import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import fetch from 'node-fetch';
import ReactDOMServer from 'react-dom/server';
import pdf from 'html-pdf';
import fs from 'fs';
import queryString from 'query-string';

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
    case PDF_TYPES.ANONYMOUS_LOAN:
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
    return new Buffer(file).toString('base64');
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

  fetchPDF = (html, fileName, pdfName) => {
    const API_KEY = 'GkjsAcqhD34P070MOF4I';
    const body = {
      user_credentials: API_KEY,
      doc: {
        document_content: html,
        name: pdfName,
        type: 'pdf',
        test: true,
        // help: true,
        prince_options: {
          media: 'screen',
        },
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

  // fetchPDF = (html, fileName) => {
  //   const API_KEY = '66e0248f5aec81111eaca537eee6d6df';
  //   const params = {
  //     access_key: API_KEY,
  //     document_html: '<html><body><h1>Hello_my_dude</h1></body></html>',
  //     // document_html: '<h1>Hello_my_dude</h1>',
  //     // document_url: 'https://pdflayer.com/downloads/invoice.html',
  //     test: 1,
  //   };
  //   const url = `https://api.pdflayer.com/api/convert?${queryString.stringify(
  //     params,
  //     { encode: false, sort: false },
  //   )}`;
  //   let fetchResult;
  //   console.log('fetchResult', fetchResult);

  //   return fetch(url, { method: 'POST' })
  //     .then((result) => {
  //       fetchResult = result;
  //       return result;
  //     })
  //     .then(result => result.json())
  //     .catch((error) => {
  //       // When pdfs are valid, .json() fails
  //       // so skip this error
  //       console.log('wut?');
  //     })
  //     .then((json) => {
  //       console.log('json', json);

  //       if (!json.success) {
  //         new Meteor.Error(json.error.code, json.error.info);
  //       }
  //     })
  //     .then(() => this.streamToBase64(fetchResult.body))
  //     .then((base64) => {
  //       console.log('base64', base64);
  //       return base64;
  //     });
  // .then((res) => {
  //   const dest = fs.createWriteStream(`/tmp/${fileName}.pdf`);
  //   const stream = res.body.pipe(dest);
  //   return new Promise((resolve) => {
  //     stream.on('finish', resolve);
  //   });
  // })
  // .then(() => this.getBase64String(`/tmp/${fileName}.pdf`))
  // .catch((error) => {
  //   console.log('pdflayer error', error);
  //   throw error
  // });
  // };

  generatePDF = (html, fileName, pdfName) =>
    this.fetchPDF(html, fileName, pdfName);
  // pdf
  //   .create(html, {
  //     format: 'a4',
  //     border: {
  //       top: '2cm',
  //       right: '1.5cm',
  //       left: '1.5cm',
  //       bottom: '2cm',
  //     },
  //   })
  //   .toFile(`./tmp/${fileName}.pdf`, (error, response) => {
  //     if (error) {
  //       this.module.reject(error);
  //     } else {
  //       this.module.resolve({
  //         fileName,
  //         base64: this.getBase64String(response.filename),
  //       });
  //       fs.unlink(response.filename);
  //     }
  //   });

  handleGeneratePDF = ({ component, props, fileName, pdfName }, testing) => {
    const html = this.getComponentAsHTML(component, props);
    if (testing) {
      fs.writeFileSync('/tmp/pdf_output.html', html);
    }

    if (html && fileName) {
      console.log('generating pdf...');

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
