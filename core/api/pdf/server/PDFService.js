import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import fetch from 'node-fetch';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

import { makeCheckObjectStructure } from 'core/utils/checkObjectStructure';
import adminLoan from '../../loans/queries/adminLoan';
import { formatLoanWithPromotion } from '../../../utils/loanFunctions';
import LoanBankPDF from '../pdfComponents/LoanBankPDF';
import { PDF_TYPES, TEMPLATES } from '../pdfConstants';
import { frenchErrors } from './pdfHelpers';

const PDF_URL = 'https://docraptor.com/docs';

class PDFService {
  constructor() {
    this.module = null;
  }

  makePDF = ({ type, params, options, htmlOnly }) => {
    const data = this.getDataForPDF(type, params);
    this.checkData({ data, type });
    const { component, props, fileName, pdfName } = this.makeConfigForPDF({
      data,
      type,
      options,
    });
    const html = this.getComponentAsHTML(component, props);

    if (htmlOnly) {
      return Promise.resolve(html);
    }

    return this.fetchPDF(html, fileName, pdfName);
  };

  checkData = ({ data, type }) => {
    const checkObjectStructure = makeCheckObjectStructure(frenchErrors);

    try {
      checkObjectStructure({
        obj: data,
        template: TEMPLATES[type],
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  };

  getDataForPDF = (type, params) => {
    switch (type) {
    case PDF_TYPES.LOAN: {
      const { loanId } = params;
      const loan = adminLoan.clone({ loanId }).fetchOne();
      if (loan.hasPromotion) {
        return formatLoanWithPromotion(loan);
      }

      return loan;
    }
    default:
    }
  };

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

  fetchPDF = (html, fileName, pdfName) => {
    const API_KEY = Meteor.settings.DOC_RAPTOR_API_KEY;
    const body = {
      user_credentials: API_KEY,
      doc: {
        document_content: html,
        name: pdfName,
        type: 'pdf',
        test: !Meteor.isProduction || Meteor.isStaging,
        // help: true,
        prince_options: { media: 'screen' },
      },
    };

    return fetch(PDF_URL, {
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
}

export default new PDFService();
