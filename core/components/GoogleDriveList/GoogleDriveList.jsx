import React from 'react';
import moment from 'moment';

const GoogleDriveList = ({ files }) => (
  <div className="google-drive-list">
    {files
      .map(({ id, name, webViewLink, createdTime, modifiedTime, iconLink }) => (
        <div key={id} className="google-drive-list-item">
          <a
            className="color"
            href={webViewLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={iconLink} alt="icon" />
            <h4>{name}</h4>
          </a>
          <p className="secondary">
            <span>
              Créé:&nbsp;
              <b>{moment(createdTime).fromNow()}</b>
            </span>
            &nbsp;
            <span>
              Modifié:&nbsp;
              <b>{moment(modifiedTime).fromNow()}</b>
            </span>
          </p>
        </div>
      ))
      .map((tag, index) => [index !== 0 && <hr />, tag])}
  </div>
);

export default GoogleDriveList;
