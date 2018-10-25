import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';
import adminLoan from '../loans/queries/adminLoan';
import { PDF_TYPES } from './pdfGeneratorConstants';

const REMOTE_CONNECTION_INTERVAL = 50;
const REMOTE_CONNECTION_TIMEOUT = 1000;
const MAX_COUNT = REMOTE_CONNECTION_TIMEOUT / REMOTE_CONNECTION_INTERVAL;

class PDFGeneratorService {
  init = () => {
    this.remote = DDP.connect(Meteor.settings.public.subdomains.pdf);
  };

  connect = () => {
    this.init();
    return this.checkRemoteConnection();
  };

  checkRemoteConnection = () =>
    new Promise((resolve, reject) => {
      if (this.remote.status().connected) {
        resolve();
      } else {
        this.remote.reconnect();

        let counter = 0;
        const interval = setInterval(() => {
          if (!this.remote.status().connected) {
            counter += 1;
            return;
          }
          if (counter > MAX_COUNT) clearInterval(interval);
          resolve();
        }, REMOTE_CONNECTION_INTERVAL);
      }
    });

  getDataForPDF = (type, params) => {
    switch (type) {
    case PDF_TYPES.ANONYMOUS_LOAN: {
      const { loanId } = params;
      return adminLoan.clone({ _id: loanId }).fetchOne();
    }
    default:
      throw new Meteor.Error(`Unknown pdf type: ${type}`);
    }
  };

  generatePDF = ({ type, params }) => {
    const data = this.getDataForPDF(type, params);

    return this.connect().then(() =>
      new Promise((resolve, reject) => {
        this.remote.call('_generatePDF', { type, data }, (error, result) => {
          this.remote.disconnect();
          if (error) {
            reject(error);
          }
          resolve(result && result.base64);
        });
      }));
  };
}

export default new PDFGeneratorService();
