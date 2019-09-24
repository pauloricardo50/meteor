// @flow
import React from 'react';

import { withSmartQuery } from 'core/api/containerToolkit';
import { loanGoogleDriveFiles } from 'core/api/googleDrive/queries';
import GoogleDriveList from '../GoogleDriveList';

type LoanGoogleDriveProps = {};

const LoanGoogleDrive = ({ googleDrive, name }: LoanGoogleDriveProps) => {
  if (!googleDrive || !googleDrive.folder) {
    return (
      <div className="card1 card-top">
        <h3>Google Drive</h3>
        <p className="description">
          Pas de dossier trouvé dans Emprunteurs, crées-en un qui commence par
          {' '}
          <b>{name}</b>
        </p>
      </div>
    );
  }

  const { folder, files } = googleDrive;

  return (
    <div className="loan-google-drive card1 card-top">
      <div className="flex">
        <a
          className="color"
          href={folder.webViewLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>
            Google Drive
            {' '}
            <small className="secondary">{folder.name}</small>
          </h3>
        </a>
      </div>
      <GoogleDriveList files={files} />
    </div>
  );
};

export default withSmartQuery({
  query: loanGoogleDriveFiles,
  dataName: 'googleDrive',
  params: ({ loanId }) => ({ loanId }),
})(LoanGoogleDrive);
