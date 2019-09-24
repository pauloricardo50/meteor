import { Meteor } from 'meteor/meteor';

import { google } from 'googleapis';
import credentials from './credentials.json';

const scopes = ['https://www.googleapis.com/auth/drive'];

// API References:
// https://developers.google.com/apis-explorer/#p/drive/v3/drive.files.list
// https://medium.com/@bretcameron/how-to-use-the-google-drive-api-with-javascript-57a6cc9e5262
// https://developers.google.com/drive/api/v3/search-files
// https://developers.google.com/drive/api/v3/ref-search-terms#operators
class GoogleDriveService {
  constructor() {
    this.init();
  }

  init() {
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      scopes,
    );
    this.drive = google.drive({ version: 'v3', auth });
  }

  listFilesForFolder({ prefix }) {
    const result = {};

    return this.drive.files
      .list({
        pageSize: 1,
        q: `mimeType='application/vnd.google-apps.folder' and name contains '${prefix}'`,
        fields: 'files(id, name, webViewLink)',
        spaces: 'drive',
      })
      .then(({ data }) => {
        if (data.files.length === 0) {
          throw new Meteor.Error(404, 'Pas trouvé de dossier Google Drive');
        }

        const folder = data.files[0];
        result.folder = folder;

        return this.drive.files.list({
          pageSize: 100,
          q: `mimeType != 'application/vnd.google-apps.folder' and '${folder.id}' in parents`,
          fields: 'files(createdTime, id, kind, name, webViewLink, description, fileExtension, iconLink, modifiedTime)',
          spaces: 'drive',
        });
      })
      .then(({ data: { files } }) => {
        result.files = files;
        return result;
      });
  }
}

export default GoogleDriveService;
