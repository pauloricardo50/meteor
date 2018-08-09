import {
  MAX_FILE_SIZE,
  OBJECT_STORAGE_PATH,
  BUCKET_NAME,
} from '../fileConstants';
import ObjectStorageService from './ObjectStorageService';

const API_KEY = 'EXOfaa01de0dd64ae217e1748c2';
const SECRET_KEY = 'QOMZaTbdybrigeFg2bTeNMcXAKXBebdJjkIAoYonyRU';

const exoscaleStorageService = {
  /**
   * Define the additional parameters that your your service uses here.
   *
   * Note that some parameters like maxSize are shared by all services. You do
   * not need to define those by yourself.
   */
  directiveMatch: { key: Function },

  /**
   * Here you can set default parameters that your service will use.
   */
  directiveDefault: {},

  /**
   *
   * @param {Object} method - This is the Meteor Method context.
   * @param {Object} directive - All the parameters from the directive.
   * @param {Object} file - Information about the file as gathered by the
   * browser.
   * @param {Object} [meta] - Meta data that was passed to the uploader.
   *
   * @returns {UploadInstructions}
   */
  upload(method, directive, file, meta) {
    const fileKey = directive.key(file, meta);
    const payload = {
      key,
      bucket: BUCKET_NAME,
      'Content-Type': file.type,
    };
    const signedPayload = ObjectStorageService.createSignedPayload(payload);

    // Here you need to make sure that all parameters passed in the directive
    // are going to be enforced by the server receiving the file.
    return {
      // Endpoint where the file is to be uploaded:
      upload: OBJECT_STORAGE_PATH,

      // Download URL, once the file uploaded:
      download: `${OBJECT_STORAGE_PATH}/${fileKey}`,

      // POST data to be attached to the file-upload:
      postData: [
        { name: 'accessKey', value: API_KEY },
        { name: 'secret_key', value: SECRET_KEY },
        { name: 'key', value: fileKey },
      ],

      // HTTP headers to send when uploading:
      // headers: { 'x-foo-bar': fooData },
    };
  },

  /**
   * Absolute maximum file-size allowable by the storage service.
   */
  maxSize: MAX_FILE_SIZE,
};

export default exoscaleStorageService;
