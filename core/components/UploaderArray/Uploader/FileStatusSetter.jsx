// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { FILE_STATUS, ROLES } from 'core/api/constants';
import { setFileStatus, updateDocumentsCache } from 'core/api/methods';
import T from '../../Translation';
import DropdownMenu from '../../DropdownMenu';

type FileStatusSetterProps = {};

const FileStatusSetter = ({
  status = FILE_STATUS.UNVERIFIED,
  fileKey,
  docId,
  collection,
}: FileStatusSetterProps) => {
  const user = Meteor.user();

  if (user.roles.includes(ROLES.USER) || user.roles.includes(ROLES.PRO)) {
    return (
      <span className={`${status} bold`}>
        <T id={`File.status.${status}`} />
      </span>
    );
  }

  return (
    <DropdownMenu
      noWrapper
      renderTrigger={({ handleOpen }) => (
        <span onClick={handleOpen} className={`${status} bold`}>
          <T id={`File.status.${status}`} />
        </span>
      )}
      options={Object.values(FILE_STATUS).map(stat => ({
        id: stat,
        label: <T id={`File.status.${stat}`} />,
        onClick: () =>
          setFileStatus
            .run({ fileKey, newStatus: stat })
            .then(() => updateDocumentsCache.run({ docId, collection })),
      }))}
    />
  );
};

export default FileStatusSetter;
