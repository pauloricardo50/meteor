import React, { useMemo, useState } from 'react';

import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  UNSUCCESSFUL_INSURANCE_REQUESTS_REASONS,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  UNSUCCESSFUL_LOAN_REASONS,
} from 'core/api/loans/loanConstants';
import Table from 'core/components/DataTable/Table';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import T, { Percent } from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

const unsuccessfulStatuses = {
  [LOANS_COLLECTION]: LOAN_STATUS.UNSUCCESSFUL,
  [INSURANCE_REQUESTS_COLLECTION]: INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
};

const unsuccessfulReasons = {
  [LOANS_COLLECTION]: UNSUCCESSFUL_LOAN_REASONS,
  [INSURANCE_REQUESTS_COLLECTION]: UNSUCCESSFUL_INSURANCE_REQUESTS_REASONS,
};

const breakdownData = (data = [], collection) =>
  data
    .reduce((processedData, { unsuccessfulReason }) => {
      const isOtherReason = !Object.values(
        unsuccessfulReasons[collection],
      ).some(reason => reason === unsuccessfulReason);

      const formattedReason = isOtherReason ? 'other' : unsuccessfulReason;

      const reasonIndex = processedData.findIndex(
        ({ unsuccessfulReason: reason }) => reason === formattedReason,
      );
      if (reasonIndex !== -1) {
        const [{ count = 0 }] = processedData.splice(reasonIndex, 1);
        return [
          ...processedData,
          { unsuccessfulReason: formattedReason, count: count + 1 },
        ];
      }

      return [
        ...processedData,
        { unsuccessfulReason: formattedReason, count: 1 },
      ];
    }, [])
    .map((element = {}, index, array = []) => ({
      ...element,
      percent:
        element.count / array.reduce((total, { count }) => total + count, 0),
    }));

const UnsuccessfulReasons = () => {
  const [collection, setCollection] = useState(LOANS_COLLECTION);
  const { data, loading } = useStaticMeteorData(
    {
      query: collection,
      params: {
        $filters: {
          status: unsuccessfulStatuses[collection],
          unsuccessfulReason: { $exists: true },
        },
        unsuccessfulReason: 1,
      },
      type: 'many',
    },
    [collection],
  );

  const columns = useMemo(() => [
    {
      Header: "Raison d'archivage",
      accessor: 'unsuccessfulReason',
      Cell: ({ value: unsuccessfulReason }) => (
        <T id={`Forms.unsuccessfulReason.${unsuccessfulReason}`} />
      ),
    },
    {
      Header: 'Nombre',
      accessor: 'count',
      Cell: ({ value }) => value,
    },
    {
      Header: 'Pourcentage',
      accessor: 'percent',
      Cell: ({ value: percent }) => <Percent value={percent} />,
    },
  ]);

  const processedData = useMemo(
    () => (loading ? [] : breakdownData(data, collection)),
    [data, collection],
  );

  if (loading) {
    return null;
  }

  return (
    <div className="mt-16 flex-col center">
      <h2>Raisons d'archivage</h2>
      <RadioTabs
        options={[
          { id: LOANS_COLLECTION, label: 'Dossiers hypothécaires' },
          { id: INSURANCE_REQUESTS_COLLECTION, label: 'Dossiers assurance' },
        ]}
        onChange={setCollection}
        value={collection}
      />
      <Table
        columns={columns}
        data={processedData}
        initialSort={{ id: 'count', desc: true }}
      />
    </div>
  );
};

export default UnsuccessfulReasons;
