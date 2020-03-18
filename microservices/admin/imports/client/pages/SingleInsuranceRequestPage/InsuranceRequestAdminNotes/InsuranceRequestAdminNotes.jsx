import React, { useState } from 'react';
import { withProps } from 'recompose';

import { AdminNotes } from 'core/components/AdminNotes/AdminNotes';
import {
  INSURANCES_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
} from 'core/api/constants';
import Checkbox from 'core/components/Checkbox';
import InsuranceRequestAdminNoteAdder from './InsuranceRequestAdminNoteAdder';

const SelectDocumentFilter = ({
  documentFilter,
  setDocumentFilter,
  availableDocuments = [],
}) => (
  <div className="flex-row ml-8">
    {availableDocuments.map(({ id, label }) => {
      const value = !!documentFilter.find(doc => doc === id);
      return (
        <Checkbox
          key={id}
          value={value}
          id={id}
          label={label}
          onChange={() => {
            if (value) {
              setDocumentFilter(documentFilter.filter(doc => doc !== id));
            } else {
              setDocumentFilter([...documentFilter, id]);
            }
          }}
        />
      );
    })}
  </div>
);

export default withProps(({ insuranceRequest }) => {
  const {
    _id: docId,
    name: insuranceRequestName,
    proNotes: insuranceRequestProNotes = [],
    adminNotes: insuranceRequestAdminNotes = [],
    proNote: insuranceRequestProNote,
    user: { referredByUser } = {},
    insurances = [],
  } = insuranceRequest;

  const availableDocuments = [
    { id: docId, label: insuranceRequestName },
    ...insurances.map(({ _id, name }) => ({ id: _id, label: name })),
  ];

  const [documentFilter, setDocumentFilter] = useState(
    availableDocuments.map(({ id }) => id),
  );

  const insurancesProNotes = insurances.reduce(
    (notes, { proNotes = [], _id }) => [
      ...notes,
      ...proNotes.map(note => ({
        ...note,
        docId: _id,
        collection: INSURANCES_COLLECTION,
      })),
    ],
    [],
  );
  const insurancesAdminNotes = insurances.reduce(
    (notes, { adminNotes = [], _id }) => [
      ...notes,
      ...adminNotes.map(note => ({
        ...note,
        docId: _id,
        collection: INSURANCES_COLLECTION,
      })),
    ],
    [],
  );

  const proNotes = [
    ...insuranceRequestProNotes.map(note => ({
      ...note,
      docId,
      collection: INSURANCE_REQUESTS_COLLECTION,
    })),
    ...insurancesProNotes,
  ].filter(({ docId: id }) => documentFilter.includes(id));

  const adminNotes = [
    ...insuranceRequestAdminNotes.map(note => ({
      ...note,
      docId,
      collection: INSURANCE_REQUESTS_COLLECTION,
    })),
    ...insurancesAdminNotes,
  ].filter(({ docId: id }) => documentFilter.includes(id));

  const [proNote] = [
    {
      ...insuranceRequestProNote,
      docId,
      collection: INSURANCE_REQUESTS_COLLECTION,
    },
    ...insurances.map(({ proNote: insuranceProNote, _id }) => ({
      ...insuranceProNote,
      docId: _id,
      collection: INSURANCES_COLLECTION,
    })),
  ]
    .sort(({ date: dateA }, { date: dateB }) => dateA - dateB)
    .filter(({ docId: id }) => documentFilter.includes(id));

  return {
    doc: insuranceRequest,
    docId,
    proNotes,
    adminNotes,
    proNote,
    referredByUser,
    CustomNoteAdder: InsuranceRequestAdminNoteAdder,
    Filters: (
      <SelectDocumentFilter
        availableDocuments={availableDocuments}
        documentFilter={documentFilter}
        setDocumentFilter={setDocumentFilter}
      />
    ),
  };
})(AdminNotes);
