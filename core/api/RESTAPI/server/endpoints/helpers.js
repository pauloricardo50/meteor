import { Meteor } from 'meteor/meteor';

import SimpleSchema from 'simpl-schema';
import s3 from 's3';

import { getS3FileKey } from '../../../files/server/meteor-slingshot-server';
import UserService from '../../../users/server/UserService';
import {
  EXOSCALE_PATH,
  OBJECT_STORAGE_REGION,
  S3_ACLS,
  OBJECT_STORAGE_PATH,
} from '../../../files/fileConstants';
import FileService from '../../../files/server/FileService';

const anyOrganisationMatches = ({
  userOrganisations = [],
  proOrganisations = [],
}) =>
  userOrganisations.some(userOrganisation =>
    proOrganisations.some(proOrganisation => userOrganisation._id === proOrganisation._id));

export const getImpersonateUserId = ({ userId, impersonateUser }) => {
  const { organisations: userOrganisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { _id: 1 },
  });

  const user = UserService.getByEmail(impersonateUser);
  let proId;
  let proOrganisations;

  if (user) {
    proId = user._id;
    proOrganisations = UserService.fetchOne({
      $filters: { _id: user._id },
      organisations: { _id: 1 },
    }).organisations || [];
  }

  if (!proId) {
    throw new Meteor.Error(`No user found for email address "${impersonateUser}"`);
  }

  if (
    userOrganisations.length === 0
    || proOrganisations.length === 0
    || !anyOrganisationMatches({ userOrganisations, proOrganisations })
  ) {
    throw new Meteor.Error(`User with email address "${impersonateUser}" is not part of your organisation`);
  }

  return proId;
};

export const checkQuery = ({ query, schema }) => {
  const cleanQuery = schema.clean(query);
  try {
    schema.validate(cleanQuery);
  } catch (error) {
    throw new Meteor.Error(error);
  }

  return cleanQuery;
};

export const checkAccessToUser = ({ user, proId }) => {
  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: proId },
    organisations: { users: { _id: 1 } },
  });

  if (
    !organisations.some(({ _id }) => _id === user.referredByOrganisationLink)
    && !organisations.some(({ users = [] }) =>
      users.some(({ _id }) => _id === user.referredByUserLink))
  ) {
    throw new Meteor.Error(`User with email "${user.emails[0].address}" not found, or you don't have access to it.`);
  }
};

export const impersonateSchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

export const uploadFileToS3 = ({ file, docId, id, collection }) =>
  new Promise((resolve, reject) => {
    const { originalFilename, path } = file;
    const client = s3.createClient({
      s3Options: {
        accessKeyId: Meteor.settings.exoscale.API_KEY,
        secretAccessKey: Meteor.settings.exoscale.SECRET_KEY,
        endpoint: EXOSCALE_PATH,
        region: OBJECT_STORAGE_REGION,
      },
    });

    const key = getS3FileKey({ name: originalFilename }, { docId, id });

    const params = {
      localFile: path,
      s3Params: {
        Bucket: Meteor.settings.storage.bucketName,
        Key: key,
        ACL: S3_ACLS.PUBLIC_READ,
        ContentDisposition: `inline; filename="${encodeURIComponent(originalFilename)}"; filename*=utf-8''${encodeURIComponent(originalFilename)}`,
      },
    };

    const uploader = client.uploadFile(params);
    uploader.on('error', (err) => {
      reject(err.stack);
    });

    uploader.on('end', () => {
      FileService.updateDocumentsCache({ docId, collection }).then(() => {
        resolve(`${OBJECT_STORAGE_PATH}/${key}`);
      });
    });
  });
