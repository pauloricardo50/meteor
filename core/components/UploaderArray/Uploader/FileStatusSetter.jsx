//      
import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';
import SimpleSchema from 'simpl-schema';

import { FILE_STATUS, ROLES } from 'core/api/constants';
import DialogForm from 'core/components/ModalManager/DialogForm';
import { setFileError } from 'core/api/methods/index';
import T from '../../Translation';
import DropdownMenu from '../../DropdownMenu';
import { ModalManagerContext } from '../../ModalManager';

                                

const FileStatusSetter = ({
  status = FILE_STATUS.UNVERIFIED,
  fileKey,
  handleChangeFileStatus,
  error: currentError,
}                       ) => {
  const { openModal } = useContext(ModalManagerContext);

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
        <span
          onClick={handleOpen}
          className={`${status} bold file-status-setter`}
        >
          <T id={`File.status.${status}`} />
        </span>
      )}
      options={Object.values(FILE_STATUS).map(stat => ({
        id: stat,
        label: <T id={`File.status.${stat}`} />,
        onClick: () => {
          if (stat !== FILE_STATUS.ERROR) {
            return handleChangeFileStatus(stat, fileKey);
          }

          openModal(
            <DialogForm
              schema={
                new SimpleSchema({
                  error: { type: String, optional: true },
                })
              }
              model={{ error: currentError }}
              title="Fichier non valide"
              description="Entrez la raison"
              className="animated fadeIn"
              important
              onSubmit={({ error }) =>
                setFileError
                  .run({ fileKey, error })
                  .then(() => handleChangeFileStatus(stat, fileKey))
              }
            />,
          );
        },
      }))}
    />
  );
};

export default FileStatusSetter;
