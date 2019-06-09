// @flow
import React, { useState } from 'react';
import { updateDocument, updateDocumentUnset } from 'core/api/methods/index';

type UpdateFormProps = {};

const UpdateForm = ({ id, collection }: UpdateFormProps) => {
  const [$set, setSet] = useState('');
  const [$unset, setUnset] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if ($set) {
          updateDocument
            .run({
              docId: id,
              object: JSON.parse($set),
              collection,
            })
            .then(() => setSet(''));
        }
        if ($unset) {
          updateDocumentUnset
            .run({
              docId: id,
              object: JSON.parse($unset),
              collection,
            })
            .then(() => setUnset(''));
        }
      }}
    >
      <label htmlFor="$set">
        $set:
        <input
          value={$set}
          onChange={e => setSet(e.target.value)}
          id="$set"
          type="text"
        />
      </label>
      <label htmlFor="$unset">
        $unset:
        <input
          value={$unset}
          onChange={e => setUnset(e.target.value)}
          id="$unset"
          type="text"
        />
      </label>

      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateForm;
