/* eslint-env mocha */
import { expect } from 'chai';

import { additionalDocumentsAutovalue } from '../sharedSchemas';

describe.only('additionalDocumentsAutovalue', () => {
  let autovalueContext;

  const INITIAL_DOCUMENTS = {
    INITIAL_DOCUMENT_1: 'INITIAL_DOCUMENT_1',
    INITIAL_DOCUMENT_2: 'INITIAL_DOCUMENT_2',
  };

  const initialDocuments = [
    { id: INITIAL_DOCUMENTS.INITIAL_DOCUMENT_1 },
    { id: INITIAL_DOCUMENTS.INITIAL_DOCUMENT_2 },
  ];

  const DOC_KEYS = {
    KEY1: {
      name: 'KEY1',
      values: ['KEY1_VALUE1', 'KEY1_VALUE2'],
    },
    KEY2: {
      name: 'KEY2',
      values: ['KEY2_VALUE1', 'KEY2_VALUE2'],
    },
  };

  const conditionalDocuments = [
    {
      id: 'conditionalDocument1',
      condition: ({ doc, context }) =>
        doc[DOC_KEYS.KEY1.name] !== DOC_KEYS.KEY1.values[0]
        && context.field(DOC_KEYS.KEY1.name).value === DOC_KEYS.KEY1.values[0],
    },
    {
      id: 'conditionalDocument2',
      condition: ({ doc, context }) =>
        doc[DOC_KEYS.KEY1.name] !== DOC_KEYS.KEY1.values[1]
        && context.field(DOC_KEYS.KEY1.name).value === DOC_KEYS.KEY1.values[1],
    },
    {
      id: 'conditionalDocument3',
      condition: ({ doc, context }) =>
        doc[DOC_KEYS.KEY2.name] !== DOC_KEYS.KEY2.values[0]
        && context.field(DOC_KEYS.KEY2.name).value === DOC_KEYS.KEY2.values[0],
    },
    {
      id: 'conditionalDocument3',
      condition: ({ doc, context }) =>
        doc[DOC_KEYS.KEY2.name] !== DOC_KEYS.KEY2.values[1]
        && context.field(DOC_KEYS.KEY2.name).value === DOC_KEYS.KEY2.values[1],
    },
  ];

  beforeEach(() => {
    autovalueContext = {
      isInsert: false,
      fields: {},
      field(fieldName) {
        return { value: this.fields[fieldName] };
      },
    };
  });

  it('should add initial documents if doc is inserted', () => {
    autovalueContext.isInsert = true;
    const doc = {
      additionalDocuments: [],
    };

    expect(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    })).to.deep.contain(...initialDocuments);
  });

  it('should not remove initial documents if doc is updated', () => {
    autovalueContext.isInsert = false;
    const doc = {
      additionalDocuments: initialDocuments,
    };

    expect(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    })).to.deep.contain(...initialDocuments);
  });
});
