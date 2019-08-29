/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { DOCUMENTS } from 'core/api/files/fileConstants';
import S3Service from '../../../../../files/server/S3Service';
import { zipDocuments } from '../zipHelpers';
import { getFileName, generateLoanZip } from '../zipLoan';

class ZipMock {
  constructor() {
    this.zip = [];
  }

  append(stream, { name }) {
    this.zip = [...this.zip, name];
  }

  pipe = () => null;

  finalize = () => null;

  getZip() {
    return this.zip;
  }
}

describe('zipLoan', () => {
  let zip;
  let spy;

  beforeEach(() => {
    spy = sinon.spy();
    sinon.stub(S3Service, 'getObjectReadStream').callsFake(spy);
    zip = new ZipMock();
  });

  afterEach(() => {
    S3Service.getObjectReadStream.restore();
  });

  describe('zipDocuments', () => {
    it('returns correct index and total', () => {
      const documents = {
        a: [{ Key: '1' }],
        b: [{ Key: '2' }, { Key: '3' }],
        c: [{ Key: '4' }, { Key: '5', adminname: 'adminName' }, { Key: '6' }],
      };

      const formatFileName = (file, index, total) => ({
        Key: file.Key,
        index,
        total,
      });

      zipDocuments({ zip, documents, formatFileName });

      expect(spy.args).to.deep.equal([
        ['1'],
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['6'],
      ]);
      expect(zip.getZip()).to.deep.equal([
        { Key: '1', index: 0, total: 1 },
        { Key: '2', index: 0, total: 2 },
        { Key: '3', index: 1, total: 2 },
        { Key: '4', index: 0, total: 2 },
        { Key: '5', index: 0, total: 1 },
        { Key: '6', index: 1, total: 2 },
      ]);
    });
  });
  describe('getFileName', () => {
    context('returns the correct name for', () => {
      it('a single file', () => {
        const prefix = 'PREFIX_';
        const file = {
          Key: `123/${DOCUMENTS.IDENTITY}/identity.pdf`,
          index: 0,
          total: 1,
          prefix,
        };
        const name = getFileName(file);

        expect(name).to.equal("PREFIX_Pièce d'identité.pdf");
      });

      it('two files in same document', () => {
        const prefix = 'PREFIX_';
        const file1 = {
          Key: `123/${DOCUMENTS.IDENTITY}/identity.pdf`,
          index: 0,
          total: 2,
          prefix,
        };
        const file2 = {
          Key: `123/${DOCUMENTS.IDENTITY}/identity.pdf`,
          index: 1,
          total: 2,
          prefix,
        };
        const name1 = getFileName(file1);
        const name2 = getFileName(file2);

        expect(name1).to.equal("PREFIX_Pièce d'identité (1 sur 2).pdf");
        expect(name2).to.equal("PREFIX_Pièce d'identité (2 sur 2).pdf");
      });

      it('one file with adminName', () => {
        const prefix = 'PREFIX_';
        const file = {
          Key: `123/${DOCUMENTS.IDENTITY}/identity.pdf`,
          adminName: 'adminName',
          index: 0,
          total: 1,
          prefix,
        };
        const name = getFileName(file);

        expect(name).to.equal('adminName.pdf');
      });

      it('three files in same document with one file with adminName', () => {
        const prefix = 'PREFIX_';
        const file1 = {
          Key: `123/${DOCUMENTS.IDENTITY}/identity.pdf`,
          index: 0,
          total: 2,
          prefix,
        };
        const file2 = {
          Key: `123/${DOCUMENTS.IDENTITY}/identity.pdf`,
          adminName: 'adminName',
          index: 0,
          total: 1,
          prefix,
        };
        const file3 = {
          Key: `123/${DOCUMENTS.IDENTITY}/identity.pdf`,
          index: 1,
          total: 2,
          prefix,
        };
        const name1 = getFileName(file1);
        const name2 = getFileName(file2);
        const name3 = getFileName(file3);

        expect(name1).to.equal("PREFIX_Pièce d'identité (1 sur 2).pdf");
        expect(name2).to.equal('adminName.pdf');
        expect(name3).to.equal("PREFIX_Pièce d'identité (2 sur 2).pdf");
      });
    });
  });

  describe('generateLoanZip', () => {
    it('generates the correct zip for a given loan', () => {
      const loan = {
        _id: 'loan',
        name: 'LOAN',
        borrowers: [
          {
            _id: 'borrower1',
            firstName: 'Bob',
            lastName: 'Dylan',
            name: 'Bob Dylan',
            documents: {
              [DOCUMENTS.IDENTITY]: [
                {
                  Key: `borrower1/${DOCUMENTS.IDENTITY}/id.pdf`,
                },
              ],
              [DOCUMENTS.LAST_SALARIES]: [
                {
                  Key: `borrower1/${DOCUMENTS.LAST_SALARIES}/lastSalary1.pdf`,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LAST_SALARIES}/lastSalary2.pdf`,
                },
              ],
              [DOCUMENTS.LEGITIMATION_CARD]: [
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/legitimationCard1.pdf`,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/customLegitimationCard.pdf`,
                  adminname: 'customLegitimationCardAdminName',
                },
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/legitimationCard2.pdf`,
                },
              ],
              [DOCUMENTS.OTHER]: [
                {
                  Key: `borrower1/${DOCUMENTS.OTHER}/otherDoc.pdf`,
                  name: 'borrowerOtherDocName.pdf',
                },
              ],
            },
          },
          {
            _id: 'borrower2',
            firstName: 'Barbra',
            lastName: 'Streisand',
            name: 'Barbra Streisand',
            documents: {
              [DOCUMENTS.IDENTITY]: [
                {
                  Key: `borrower2/${DOCUMENTS.IDENTITY}/id.pdf`,
                },
              ],
            },
          },
        ],
        properties: [
          {
            _id: 'property',
            address1: 'propertyAddress',
            documents: {
              [DOCUMENTS.LAND_REGISTER_EXTRACT]: [
                {
                  Key: `property/${DOCUMENTS.LAND_REGISTER_EXTRACT}/landRegisterExtract.pdf`,
                },
              ],
            },
          },
        ],
        structure: {
          propertyId: 'property',
        },
        documents: {
          [DOCUMENTS.OTHER]: [
            {
              Key: 'loan/123/otherDoc.pdf',
              name: 'requiredByAdmin.pdf',
            },
          ],
        },
      };

      generateLoanZip(zip, loan, { writeHead: () => null });

      expect(zip.getZip()).to.deep.equal([
        'LOAN/requiredByAdmin.pdf',
        "Bob Dylan/BD Pièce d'identité.pdf",
        'Bob Dylan/BD Fiches de salaire (1 sur 2).pdf',
        'Bob Dylan/BD Fiches de salaire (2 sur 2).pdf',
        'Bob Dylan/BD Carte de Légitimation (1 sur 2).pdf',
        'Bob Dylan/customLegitimationCardAdminName.pdf',
        'Bob Dylan/BD Carte de Légitimation (2 sur 2).pdf',
        'Bob Dylan/BD borrowerOtherDocName.pdf',
        "Barbra Streisand/BS Pièce d'identité.pdf",
        'propertyAddress/propertyAddress Extrait du registre foncier.pdf',
      ]);
    });
  });
});
