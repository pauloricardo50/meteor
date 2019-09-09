import React from 'react';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import Calculator from 'core/utils/Calculator';
import T from 'core/components/Translation';
import { CustomAutoField } from 'core/components/AutoForm2/AutoFormComponents';
import { getZipLoanUrl } from 'core/api/methods/index';
import { FILE_STATUS } from 'core/api/constants';

const getAllDocuments = (loan) => {
  console.log('loan:', loan)
  const { borrowers = [], documents: loanDocs = {}, _id: loanId } = loan;
  const loanDocuments = Object.keys(loanDocs).map(doc => `${loanId}/${doc}`);
  const borrowersDocuments = borrowers.reduce(
    (borrowersDocs, { _id: borrowerId, documents: docs = [] }) => [
      ...borrowersDocs,
      ...Object.keys(docs).map(doc => `${borrowerId}/${doc}`),
    ],
    [],
  );
  const propertyDocuments = Object.keys(Calculator.selectPropertyKey({ loan, key: 'documents' }) || []).map(doc => `${Calculator.selectPropertyKey({ loan, key: '_id' })}/${doc}`);

  return [...loanDocuments, ...borrowersDocuments, ...propertyDocuments];
};

const getAllAdditionalDocuments = (loan) => {
  const {
    borrowers = [],
    additionalDocuments: loanAdditionalDocuments = [],
  } = loan;
  const borrowersAdditionalDocuments = borrowers.reduce(
    (docs, { additionalDocuments: borrowerAdditionalDocs = [] }) => [
      ...docs,
      ...borrowerAdditionalDocs,
    ],
    [],
  );
  const propertyAdditionalDocuments = Calculator.selectPropertyKey({
    loan,
    key: 'additionalDocuments',
  }) || [];
  return [
    ...loanAdditionalDocuments,
    ...borrowersAdditionalDocuments,
    ...propertyAdditionalDocuments,
  ];
};

const getDocumentsAutoFields = (doc, documents, additionalDocuments) =>
  documents.map((document, index) => {
    const { label } = additionalDocuments.find(({ id }) => id === document.split('/')[1]) || {};
    return (
      <CustomAutoField
        name={document}
        overrideLabel={label || <T id={`files.${document.split('/')[1]}`} />}
        key={`${doc}${document}${index}`}
      />
    );
  });

const getAutoFields = (loan) => {
  const { _id: loanId, name: loanName, borrowers = [] } = loan;
  const allDocuments = getAllDocuments(loan);
  const loanDocuments = {
    [loanName]: allDocuments.filter(doc => doc.split('/')[0] === loanId),
  };
  const borrowersDocuments = borrowers.reduce(
    (borrowersDocs, { _id: borrowerId, name: borrowerName }) => ({
      ...borrowersDocs,
      [borrowerName]: allDocuments.filter(doc => doc.split('/')[0] === borrowerId),
    }),
    {},
  );
  const propertyDocuments = {
    [Calculator.selectPropertyKey({
      loan,
      key: 'address1',
    })]: allDocuments.filter(doc =>
      doc.split('/')[0]
        === Calculator.selectPropertyKey({ loan, key: '_id' })),
  };

  const allDocumentsFormatted = {
    ...loanDocuments,
    ...borrowersDocuments,
    ...propertyDocuments,
  };

  const additionalDocuments = getAllAdditionalDocuments(loan);

  return (
    <div className="zip-loan-modal">
      <h4>Options</h4>
      <p className="description secondary">Veuillez sélectionner les options</p>
      <CustomAutoField
        name="splitInChunks"
        overrideLabel="Grouper les fichiers par paquets de max. 10Mb"
      />
      <br />
      <CustomAutoField
        name="status"
        overrideLabel="Télécharger uniquement les fichiers avec le status"
      />
      <br />
      <h4>Documents</h4>
      <p className="description secondary">
        Veuillez sélectionner les documents à télécharger
      </p>
      <div className="zip-loan-modal-documents">
        {Object.keys(allDocumentsFormatted).map(doc => (
          <>
            <h4>
              <small>{doc}</small>
            </h4>
            {getDocumentsAutoFields(
              doc,
              allDocumentsFormatted[doc],
              additionalDocuments,
            )}
          </>
        ))}
      </div>
    </div>
  );
};

const makeOnSubmit = (loan, closeModal) => (model) => {
  const { _id: loanId, borrowers = [] } = loan;
  const { status, splitInChunks } = model;
  const docIds = [
    loanId,
    ...borrowers.map(({ _id }) => _id),
    Calculator.selectPropertyKey({ loan, key: '_id' }),
  ];
  const documents = docIds.reduce(
    (docs, id) => ({
      ...docs,
      [id]: Object.keys(model)
        .filter(key => key.split('/')[0] === id)
        .reduce((selectedDocuments, key) => {
          if (model[key]) {
            return [...selectedDocuments, key.split('/')[1]];
          }

          return selectedDocuments;
        }, []),
    }),
    {},
  );

  return getZipLoanUrl
    .run({ loanId, documents, options: { status, splitInChunks } })
    .then((url) => {
      window.open(url);
    })
    .then(() => closeModal());
};

export default compose(withProps(({ loan, closeModal }) => ({
  schema: new SimpleSchema({
    status: {
      type: Array,
      uniforms: {
        checkboxes: true,
        transform: status => <T id={`File.status.${status}`} />,
      },
    },
    'status.$': {
      type: String,
      allowedValues: [FILE_STATUS.VALID, FILE_STATUS.UNVERIFIED],
    },
    splitInChunks: { type: Boolean, defaultValue: false },
    ...getAllDocuments(loan).reduce(
      (docs, doc) => ({
        ...docs,
        [doc]: { type: Boolean, defaultValue: true },
      }),
      {},
    ),
  }),
  fields: getAutoFields(loan),
  onSubmit: makeOnSubmit(loan, closeModal),
  model: { status: [FILE_STATUS.VALID] },
})));
