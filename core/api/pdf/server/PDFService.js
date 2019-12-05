import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check, Match } from 'meteor/check';

import fetch from 'node-fetch';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

import { adminLoans } from '../../loans/queries';
import { formatLoanWithPromotion } from '../../../utils/loanFunctions';
import { lenderRules } from '../../fragments';
import OrganisationService from '../../organisations/server/OrganisationService';
import LoanBankPDF from './pdfComponents/LoanBankPDF';
import { PDF_TYPES } from '../pdfConstants';
import { validateLoanPdf } from './pdfValidators';

const PDF_URL = 'https://docraptor.com/docs';

class PDFService {
  makePDF = ({ type, params, options, htmlOnly }) => {
    this.checkParams({ params, type });
    const data = this.getDataForPDF(type, params);
    this.checkData({ data, type });

    const { component, props, fileName, pdfName } = this.makeConfigForPDF({
      data,
      type,
      options,
    });
    const html = this.getComponentAsHTML(component, props, pdfName);

    if (htmlOnly) {
      return Promise.resolve({ html, pdfName });
    }

    return this.fetchPDF(html, fileName, pdfName);
  };

  checkData = ({ data, type }) => {
    switch (type) {
      case PDF_TYPES.LOAN: {
        try {
          validateLoanPdf(data);
        } catch (error) {
          throw new Meteor.Error(error);
        }
        break;
      }
      default:
        throw new Meteor.Error(`Invalid pdf type: ${type}`);
    }
  };

  checkParams = ({ params, type }) => {
    switch (type) {
      case PDF_TYPES.LOAN: {
        const { loanId, organisationId, structureIds } = params;
        check(loanId, String);
        check(organisationId, Match.Maybe(String));
        check(structureIds, Match.Maybe([String]));
        break;
      }

      default:
        throw new Meteor.Error(`Invalid pdf type: ${type}`);
    }
  };

  getDataForPDF = (type, params) => {
    switch (type) {
      case PDF_TYPES.LOAN: {
        const { loanId, organisationId } = params;

        const organisation =
          organisationId &&
          OrganisationService.get(organisationId, {
            lenderRules: lenderRules(),
            name: 1,
            logo: 1,
          });
        const loan = adminLoans.clone({ _id: loanId }).fetchOne();

        if (loan.hasPromotion) {
          return {
            ...params,
            loan: formatLoanWithPromotion(loan),
            organisation,
          };
        }

        return { ...params, loan, organisation };
      }
      default:
        throw new Meteor.Error(`Invalid pdf type: ${type}`);
    }
  };

  makeConfigForPDF = ({ type, data, options }) => {
    const fileName = Random.id();

    switch (type) {
      case PDF_TYPES.LOAN: {
        const { loan, organisation } = data;
        return {
          component: LoanBankPDF,
          props: { ...data, options },
          fileName,
          pdfName: organisation
            ? `${loan.name} - ${organisation.name}`
            : loan.name,
        };
      }
      default:
        throw new Meteor.Error(`Invalid pdf type: ${type}`);
    }
  };

  getBase64String = path => {
    const file = fs.readFileSync(path);
    fs.unlink(path); // Async delete
    const base64 = new Buffer(file).toString('base64');
    return base64;
  };

  getComponentAsHTML = (component, props, pdfName) =>
    ReactDOMServer.renderToStaticMarkup(component({ ...props, pdfName }));

  fetchPDF = (html, fileName, pdfName) => {
    const API_KEY = Meteor.settings.DOC_RAPTOR_API_KEY;
    const body = {
      user_credentials: API_KEY,
      doc: {
        document_content: html,
        name: pdfName,
        type: 'pdf',
        test:
          !Meteor.isProduction || Meteor.isStaging || Meteor.isDevEnvironment,
        // help: true,
        prince_options: { media: 'screen', baseurl: 'https://www.e-potek.ch' },
      },
    };

    return fetch(PDF_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) {
          throw new Meteor.Error(res.status, res.statusText);
        }
        const dest = fs.createWriteStream(`/tmp/${fileName}.pdf`);
        const stream = res.body.pipe(dest);
        return new Promise(resolve => {
          stream.on('finish', resolve);
        });
      })
      .then(() => this.getBase64String(`/tmp/${fileName}.pdf`))
      .then(base64 => ({ base64, pdfName }));
  };
}

export default new PDFService();
