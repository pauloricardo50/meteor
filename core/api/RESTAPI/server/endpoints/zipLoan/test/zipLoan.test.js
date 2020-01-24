/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { DOCUMENTS } from 'core/api/files/fileConstants';
import S3Service from '../../../../../files/server/S3Service';
import { zipDocuments } from '../zipHelpers';
import { getFileName, generateLoanZip } from '../zipLoan';
import { FILE_STATUS } from '../../../../../files/fileConstants';

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
        a: [{ Key: '1', status: FILE_STATUS.VALID }],
        b: [
          { Key: '2', status: FILE_STATUS.VALID },
          { Key: '3', status: FILE_STATUS.VALID },
        ],
        c: [
          { Key: '4', status: FILE_STATUS.VALID },
          { Key: '5', adminname: 'adminName', status: FILE_STATUS.VALID },
          { Key: '6', status: FILE_STATUS.VALID },
          { Key: '7' },
        ],
      };

      const formatFileName = (file, index, total) => ({
        Key: file.Key,
        index,
        total,
      });

      zipDocuments({
        zip,
        documents,
        formatFileName,
        options: { status: [FILE_STATUS.VALID] },
      });

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

        expect(name).to.equal(
          "PREFIX_Pièce d'identité en cours de validité.pdf",
        );
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

        expect(name1).to.equal(
          "PREFIX_Pièce d'identité en cours de validité (1 sur 2).pdf",
        );
        expect(name2).to.equal(
          "PREFIX_Pièce d'identité en cours de validité (2 sur 2).pdf",
        );
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

        expect(name).to.equal('PREFIX_adminName.pdf');
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

        expect(name1).to.equal(
          "PREFIX_Pièce d'identité en cours de validité (1 sur 2).pdf",
        );
        expect(name2).to.equal('PREFIX_adminName.pdf');
        expect(name3).to.equal(
          "PREFIX_Pièce d'identité en cours de validité (2 sur 2).pdf",
        );
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
                  status: FILE_STATUS.VALID,
                },
              ],
              [DOCUMENTS.LAST_SALARIES]: [
                {
                  Key: `borrower1/${DOCUMENTS.LAST_SALARIES}/lastSalary1.pdf`,
                  status: FILE_STATUS.VALID,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LAST_SALARIES}/lastSalary2.pdf`,
                  status: FILE_STATUS.VALID,
                },
              ],
              [DOCUMENTS.LEGITIMATION_CARD]: [
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/legitimationCard1.pdf`,
                  status: FILE_STATUS.VALID,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/customLegitimationCard.pdf`,
                  adminname: 'customLegitimationCardAdminName',
                  status: FILE_STATUS.VALID,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/legitimationCard2.pdf`,
                  status: FILE_STATUS.VALID,
                },
              ],
              [DOCUMENTS.OTHER]: [
                {
                  Key: `borrower1/${DOCUMENTS.OTHER}/otherDoc.pdf`,
                  name: 'borrowerOtherDocName.pdf',
                  status: FILE_STATUS.VALID,
                },
              ],
              customDoc: [
                {
                  Key: 'borrower1/customDoc/otherDoc2.pdf',
                  status: FILE_STATUS.VALID,
                },
              ],
            },
            additionalDocuments: [
              {
                id: 'customDoc',
                label: 'Other doc',
              },
            ],
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
                  status: FILE_STATUS.VALID,
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
                  status: FILE_STATUS.VALID,
                },
              ],
              [DOCUMENTS.PROPERTY_PLANS]: [
                {
                  Key: `property/${DOCUMENTS.PROPERTY_PLANS}/propertyPlans.pdf`,
                },
              ],
              [DOCUMENTS.PROPERTY_VOLUME]: [
                {
                  Key: `property/${DOCUMENTS.PROPERTY_VOLUME}/propertyPlans.pdf`,
                  status: FILE_STATUS.VALID,
                },
                {
                  Key: `property/${DOCUMENTS.PROPERTY_VOLUME}/propertyPlans2.pdf`,
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
              status: FILE_STATUS.VALID,
            },
          ],
        },
      };

      generateLoanZip({
        zip,
        loan,
        documents: {
          loan: [DOCUMENTS.OTHER],
          borrower1: [
            DOCUMENTS.IDENTITY,
            DOCUMENTS.LAST_SALARIES,
            DOCUMENTS.LEGITIMATION_CARD,
            DOCUMENTS.OTHER,
            'customDoc',
          ],
          borrower2: [DOCUMENTS.IDENTITY],
          property: [
            DOCUMENTS.LAND_REGISTER_EXTRACT,
            DOCUMENTS.PROPERTY_VOLUME,
          ],
        },
        options: { status: [FILE_STATUS.VALID] },
        res: { writeHead: () => null },
      });

      expect(zip.getZip()).to.deep.equal([
        'LOAN/requiredByAdmin.pdf',
        "Bob Dylan/BD Pièce d'identité en cours de validité.pdf",
        'Bob Dylan/BD 3 dernières fiches de salaire (1 sur 2).pdf',
        'Bob Dylan/BD 3 dernières fiches de salaire (2 sur 2).pdf',
        'Bob Dylan/BD Carte de légitimation (1 sur 2).pdf',
        'Bob Dylan/BD customLegitimationCardAdminName.pdf',
        'Bob Dylan/BD Carte de légitimation (2 sur 2).pdf',
        'Bob Dylan/BD borrowerOtherDocName.pdf',
        'Bob Dylan/BD Other doc.pdf',
        "Barbra Streisand/BS Pièce d'identité en cours de validité.pdf",
        'propertyAddress/propertyAddress Extrait du registre foncier.pdf',
        'propertyAddress/propertyAddress Calcul du cube SIA.pdf',
      ]);
    });

    it('generates the correct zip for a given loan using chunks', () => {
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
                  status: FILE_STATUS.VALID,
                  Size: 1500000,
                },
              ],
              [DOCUMENTS.LAST_SALARIES]: [
                {
                  Key: `borrower1/${DOCUMENTS.LAST_SALARIES}/lastSalary1.pdf`,
                  status: FILE_STATUS.VALID,
                  Size: 2000000,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LAST_SALARIES}/lastSalary2.pdf`,
                  Size: 2500000,
                  status: FILE_STATUS.VALID,
                },
              ],
              [DOCUMENTS.LEGITIMATION_CARD]: [
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/legitimationCard1.pdf`,
                  Size: 2500000,
                  status: FILE_STATUS.VALID,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/customLegitimationCard.pdf`,
                  adminname: 'customLegitimationCardAdminName',
                  Size: 2000000,
                  status: FILE_STATUS.VALID,
                },
                {
                  Key: `borrower1/${DOCUMENTS.LEGITIMATION_CARD}/legitimationCard2.pdf`,
                  Size: 1000000,
                  status: FILE_STATUS.VALID,
                },
              ],
              [DOCUMENTS.OTHER]: [
                {
                  Key: `borrower1/${DOCUMENTS.OTHER}/otherDoc.pdf`,
                  name: 'borrowerOtherDocName.pdf',
                  Size: 1000000,
                  status: FILE_STATUS.VALID,
                },
              ],
              customDoc: [
                {
                  Key: 'borrower1/customDoc/otherDoc2.pdf',
                  Size: 2500000,
                  status: FILE_STATUS.VALID,
                },
              ],
            },
            additionalDocuments: [
              {
                id: 'customDoc',
                label: 'Other doc',
              },
            ],
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
                  Size: 2000000,
                  status: FILE_STATUS.VALID,
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
                  Size: 1000000,
                  status: FILE_STATUS.VALID,
                },
              ],
              [DOCUMENTS.PROPERTY_PLANS]: [
                {
                  Size: 1500000,
                  Key: `property/${DOCUMENTS.PROPERTY_PLANS}/propertyPlans.pdf`,
                },
              ],
              [DOCUMENTS.PROPERTY_VOLUME]: [
                {
                  Key: `property/${DOCUMENTS.PROPERTY_VOLUME}/propertyPlans.pdf`,
                  Size: 4000000,
                  status: FILE_STATUS.VALID,
                },
                {
                  Size: 1200000,
                  Key: `property/${DOCUMENTS.PROPERTY_VOLUME}/propertyPlans2.pdf`,
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
              Size: 2000000,
              status: FILE_STATUS.VALID,
            },
          ],
        },
      };

      generateLoanZip({
        zip,
        loan,
        documents: {
          loan: [DOCUMENTS.OTHER],
          borrower1: [
            DOCUMENTS.IDENTITY,
            DOCUMENTS.LAST_SALARIES,
            DOCUMENTS.LEGITIMATION_CARD,
            DOCUMENTS.OTHER,
            'customDoc',
          ],
          borrower2: [DOCUMENTS.IDENTITY],
          property: [
            DOCUMENTS.LAND_REGISTER_EXTRACT,
            DOCUMENTS.PROPERTY_VOLUME,
          ],
        },
        options: {
          status: [FILE_STATUS.VALID],
          packFiles: true,
          packSize: 10000000,
        },
        res: { writeHead: () => null },
      });

      expect(zip.getZip()).to.deep.equal([
        'LOAN/DECK_1/requiredByAdmin.pdf',
        "Bob Dylan/DECK_1/BD Pièce d'identité en cours de validité.pdf",
        'Bob Dylan/DECK_2/BD 3 dernières fiches de salaire (1 sur 2).pdf',
        'Bob Dylan/DECK_2/BD 3 dernières fiches de salaire (2 sur 2).pdf',
        'Bob Dylan/DECK_1/BD Carte de légitimation (1 sur 2).pdf',
        'Bob Dylan/DECK_1/BD customLegitimationCardAdminName.pdf',
        'Bob Dylan/DECK_1/BD Carte de légitimation (2 sur 2).pdf',
        'Bob Dylan/DECK_3/BD borrowerOtherDocName.pdf',
        'Bob Dylan/DECK_2/BD Other doc.pdf',
        "Barbra Streisand/DECK_1/BS Pièce d'identité en cours de validité.pdf",
        'propertyAddress/DECK_1/propertyAddress Extrait du registre foncier.pdf',
        'propertyAddress/DECK_1/propertyAddress Calcul du cube SIA.pdf',
      ]);
    });
  });
});
