import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import merge from 'lodash/merge';

import {
  MAX_FILE_SIZE,
  OBJECT_STORAGE_PATH,
  FILE_STATUS,
  BUCKET_NAME,
  OBJECT_STORAGE_REGION,
} from '../fileConstants';

const { API_KEY, SECRET_KEY } = Meteor.settings.exoscale;

// const exoscaleStorageService = {
//   /**
//    * Define the additional parameters that your your service uses here.
//    *
//    * Note that some parameters like maxSize are shared by all services. You do
//    * not need to define those by yourself.
//    */
//   directiveMatch: { key: Function },

//   /**
//    * Here you can set default parameters that your service will use.
//    */
//   directiveDefault: {},

//   /**
//    *
//    * @param {Object} method - This is the Meteor Method context.
//    * @param {Object} directive - All the parameters from the directive.
//    * @param {Object} file - Information about the file as gathered by the
//    * browser.
//    * @param {Object} [meta] - Meta data that was passed to the uploader.
//    *
//    * @returns {UploadInstructions}
//    */
//   upload(method, directive, file, meta) {
//     const fileKey = directive.key(file, meta);

//     // Here you need to make sure that all parameters passed in the directive
//     // are going to be enforced by the server receiving the file.
//     return {
//       // Endpoint where the file is to be uploaded:
//       upload: OBJECT_STORAGE_PATH,

//       // Download URL, once the file uploaded:
//       download: `${OBJECT_STORAGE_PATH}/${fileKey}`,

//       // POST data to be attached to the file-upload:
//       postData: [
//         { name: 'accessKey', value: API_KEY },
//         { name: 'secret_key', value: SECRET_KEY },
//         { name: 'key', value: fileKey },
//         { name: 'acl', value: 'bucket-owner-full-control' },
//         // { name: 'x-amz-meta-test', value: 'true' },
//       ],

//       // HTTP headers to send when uploading:
//       headers: {
//         // 'x-amz-meta-status': FILE_STATUS.VALID,
//       },
//     };
//   },

//   /**
//    * Absolute maximum file-size allowable by the storage service.
//    */
//   maxSize: MAX_FILE_SIZE,
// };

const exoscaleStorageService = merge({}, Slingshot.S3Storage, {
  directiveMatch: {
    region: String,
  },
  directiveDefault: {
    bucket: BUCKET_NAME,
    bucketUrl: OBJECT_STORAGE_PATH,
    region: OBJECT_STORAGE_REGION,
    // expire: 5 * 60 * 1000, // in 5 minutes
    AWSAccessKeyId: API_KEY,
    AWSSecretAccessKey: SECRET_KEY,
    acl: 'private',
  },
});

export default exoscaleStorageService;
