import React, { useState, useEffect } from 'react';
import {
  INSURANCES_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
} from 'core/api/constants';

import Checkbox from 'core/components/Checkbox';
import AdminTimeline from '../../../components/AdminTimeline';
import InsuranceRequestTimelineTitle from './InsuranceRequestTimelineTitle';
import InsuranceRequestActivityAdder from './InsuranceRequestActivityAdder';

const AdditionalFilters = ({
  availableDocuments = [],
  documentFilter,
  setDocumentFilter,
}) => (
  <div className="flex ml-8">
    {availableDocuments.map(({ id, shortLabel }) => {
      const value = !!documentFilter.find(doc => doc === id);
      return (
        <Checkbox
          key={id}
          value={value}
          id={id}
          label={shortLabel}
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

const handleDocumentFilterChange = ({
  documentFilter,
  setTaskFilters,
  setActivityFilters,
  availableDocuments,
}) => {
  const documents = availableDocuments.filter(({ id }) =>
    documentFilter.includes(id),
  );
  const skippedDocuments = availableDocuments.filter(
    ({ id }) => !documentFilter.includes(id),
  );

  const taskFilters = {
    $and: [
      {
        $or: documents.map(({ id, collection }) => {
          if (collection === INSURANCE_REQUESTS_COLLECTION) {
            return { 'insuranceRequestLink._id': id };
          }
          return { 'insuranceLink._id': id };
        }),
      },
      {
        'insuranceLink._id': {
          $nin: skippedDocuments
            .filter(({ collection }) => collection === INSURANCES_COLLECTION)
            .map(({ id }) => id),
        },
      },
    ],
  };

  const activityFilters = {
    $or: documents.map(({ id, collection }) => {
      if (collection === INSURANCE_REQUESTS_COLLECTION) {
        return { 'insuranceRequestLink._id': id };
      }
      return { 'insuranceLink._id': id };
    }),
  };

  setTaskFilters(taskFilters);
  setActivityFilters(activityFilters);
};

const InsuranceRequestTimeline = ({ insuranceRequest }) => {
  const {
    _id: insuranceRequestId,
    name: insuranceRequestName,
    insurances = [],
  } = insuranceRequest;

  const availableDocuments = [
    {
      id: insuranceRequestId,
      label: `Dossier assurance ${insuranceRequestName}`,
      shortLabel: insuranceRequestName,
      collection: INSURANCE_REQUESTS_COLLECTION,
    },
    ...insurances.map(({ _id, name, borrower }) => ({
      id: _id,
      label: `Assurance ${borrower.name} ${name}`,
      shortLabel: name,
      collection: INSURANCES_COLLECTION,
    })),
  ];

  const [documentFilter, setDocumentFilter] = useState(
    availableDocuments.map(({ id }) => id),
  );

  const [taskFilters, setTaskFilters] = useState({
    'insuranceRequestLink._id': insuranceRequestId,
  });
  const [activityFilters, setActivityFilters] = useState({
    $or: [
      { 'insuranceRequestLink._id': insuranceRequestId },
      ...insurances.map(({ _id }) => ({ 'insuranceLink._id': _id })),
    ],
  });

  useEffect(() => {
    handleDocumentFilterChange({
      documentFilter,
      setTaskFilters,
      setActivityFilters,
      availableDocuments,
    });
  }, [documentFilter]);

  return (
    <AdminTimeline
      taskFilters={taskFilters}
      activityFilters={activityFilters}
      AdditionalFilters={
        <AdditionalFilters
          availableDocuments={availableDocuments}
          documentFilter={documentFilter}
          setDocumentFilter={setDocumentFilter}
        />
      }
      ActivityTitle={
        <InsuranceRequestTimelineTitle
          availableDocuments={availableDocuments}
        />
      }
      CustomActivityAdder={
        <InsuranceRequestActivityAdder
          availableDocuments={availableDocuments}
        />
      }
    />
  );
};

export default InsuranceRequestTimeline;
