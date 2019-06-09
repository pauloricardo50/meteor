// @flow
import React from 'react';
import AutoForm from 'core/components/AutoForm2';
import UpdateForm from './UpdateForm';

type SingleDevTabProps = {};

const SingleDevTab = ({
  doc,
  schema,
  onSubmit,
  collection,
}: SingleDevTabProps) => (
  <div>
    <h1>
      _id:
      {doc._id}
    </h1>

    <UpdateForm id={doc._id} collection={collection} />

    <AutoForm schema={schema} model={doc} onSubmit={onSubmit} />
  </div>
);

export default SingleDevTab;
