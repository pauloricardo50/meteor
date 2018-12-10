// @flow
import React from 'react';
import AutoForm from 'core/components/AutoForm2';

type SingleDevTabProps = {};

const SingleDevTab = ({ doc, schema, onSubmit }: SingleDevTabProps) => (
  <div>
    <h1>_id: {doc._id}</h1>
    <AutoForm schema={schema} model={doc} onSubmit={onSubmit} />
  </div>
);

export default SingleDevTab;
