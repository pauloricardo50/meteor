import ReactDOMServer from 'react-dom/server';
import pdf from 'html-pdf';
import fs from 'fs';
import { Random } from 'meteor/random';
import LoanBankPDF from './components/LoanBankPDF';
import { PDF_TYPES } from './constants';

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

  handleGeneratePDF = ({ component, props, fileName }, promise) => {
    this.module = promise;
    const html = this.getComponentAsHTML(component, props);
    fs.writeFileSync('/Users/quentinherzig/Desktop/main.html', html);

    if (html && fileName) this.generatePDF(html, fileName);
  };

  generateContentObject = ({ data, type, options }) => {
    const fileName = Random.id();
    switch (type) {
    case PDF_TYPES.LOAN_BANK:
      return {
        component: LoanBankPDF,
        props: { loan: data.loan, options },
        fileName,
      };

    default:
      return {};
    }
  };

  generateDataAsPDF = ({ data, type, options }) => {
    const content = this.generateContentObject({ data, type, options });
    return new Promise((resolve, reject) =>
      this.handleGeneratePDF(content, { resolve, reject }));
  };
}

export default new PDFService();
