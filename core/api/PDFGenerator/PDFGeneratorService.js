import { DDP } from 'meteor/ddp-client';
import adminLoan from '../loans/queries/adminLoan';

const REMOTE_CONNECTION_TIMEOUT = 100;

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
        setTimeout(() => {
          if (!this.remote.status().connected) {
            this.remote.disconnect();
            reject(new Meteor.Error("Can't connect to remote"));
          }
          resolve();
        }, REMOTE_CONNECTION_TIMEOUT);
      }
    });

  generateLoanBankPDF = (loanId) => {
    const loan = adminLoan.clone({ _id: loanId }).fetchOne();

    return this.connect().then(() =>
      new Promise((resolve, reject) => {
        this.remote.call(
          'generatePDF',
          { type: 'LOAN_BANK', data: { loan } },
          (error, result) => {
            this.remote.disconnect();
            error ? reject(error) : resolve(result.base64);
          },
        );
      }));
  };
}

export default new PDFGeneratorService();
