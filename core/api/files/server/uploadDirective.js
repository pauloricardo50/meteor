import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { Slingshot } from 'meteor/edgee:slingshot';
import { _ } from 'meteor/underscore';

import crypto from 'crypto';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import {
  OBJECT_STORAGE_PATH,
  BUCKET_NAME,
  OBJECT_STORAGE_REGION,
  FILE_STATUS,
  S3_ACLS,
  MAX_FILE_SIZE,
  ONE_KB,
} from '../fileConstants';
import Security from '../../security';

const { API_KEY, SECRET_KEY } = Meteor.settings.exoscale;

const FIVE_MINUTES = 5 * 60 * 1000;

const hmac256 = (key, data, encoding) =>
  crypto
    .createHmac('sha256', key)
    .update(Buffer.from(data).toString('utf-8'))
    .digest(encoding);

const formatNumber = (num, digits) => {
  const string = String(num);
  return Array(digits - string.length + 1)
    .join('0')
    .concat(string);
};

const exoscaleStorageService = {
  accessId: 'AWSAccessKeyId',
  secretKey: 'AWSSecretAccessKey',

  directiveMatch: {
    bucket: String,
    bucketUrl: Match.OneOf(String, Function),

    region: String,

    AWSAccessKeyId: String,
    AWSSecretAccessKey: String,

    acl: Match.Optional(
      Match.Where(acl => {
        check(acl, String);

        return Object.values(S3_ACLS).indexOf(acl) >= 0;
      }),
    ),

    key: Match.OneOf(String, Function),

    expire: Match.Where(expire => {
      check(expire, Number);

      return expire > 0;
    }),

    cacheControl: Match.Optional(String),
    contentDisposition: Match.Optional(Match.OneOf(String, Function, null)),

    'x-amz-meta-status': Match.Optional(String),
  },

  directiveDefault: {
    bucket: BUCKET_NAME,
    bucketUrl: OBJECT_STORAGE_PATH,
    region: OBJECT_STORAGE_REGION,
    expire: FIVE_MINUTES,
    AWSAccessKeyId: API_KEY,
    AWSSecretAccessKey: SECRET_KEY,
    acl: 'private',
  },

  getContentDisposition(method, directive, file, meta) {
    let getContentDisposition = directive.contentDisposition;

    if (!_.isFunction(getContentDisposition)) {
      getContentDisposition = function() {
        const filename = file.name && encodeURIComponent(file.name);

        return (
          directive.contentDisposition ||
          (filename &&
            `inline; filename="${filename}"; filename*=utf-8''${filename}`)
        );
      };
    }

    return getContentDisposition.call(method, file, meta);
  },

  getMaxSize(directive, meta) {
    // Only allow client maxSizes that are smaller than server defined maxSize
    if (meta.maxSize && meta.maxSize <= directive.maxSize) {
      return meta.maxSize;
    }

    return directive.maxSize || MAX_FILE_SIZE;
  },

  getDefaultStatus(meta, method) {
    if (Security.isUserAdmin(method.userId)) {
      return FILE_STATUS.VALID;
    }

    if (
      [ORGANISATIONS_COLLECTION, PROMOTIONS_COLLECTION].includes(
        meta.collection,
      )
    ) {
      return FILE_STATUS.VALID;
    }

    return FILE_STATUS.UNVERIFIED;
  },

  /**
   *
   * @param {{userId: String}} method
   * @param {Directive} directive
   * @param {FileInfo} file
   * @param {Object} [meta]
   *
   * @returns {UploadInstructions}
   */
  upload(method, directive, file, meta) {
    const maxSize = this.getMaxSize(directive, meta);
    const policy = new Slingshot.StoragePolicy()
      .expireIn(directive.expire)
      .contentLength(0, Math.min(file.size, maxSize));

    if (file.size > maxSize) {
      throw new Meteor.Error(
        `Votre fichier ne peut pas dépasser ${maxSize /
          ONE_KB}kb, essayez de réduire la résolution du fichier, ou de le compresser à l'aide de tinyjpg.com`,
      );
    }

    const payload = {
      key: _.isFunction(directive.key)
        ? directive.key.call(method, file, meta)
        : directive.key,

      bucket: directive.bucket,

      'Content-Type': file.type,
      acl: meta.acl || directive.acl,

      'Cache-Control': directive.cacheControl,
      'Content-Disposition': this.getContentDisposition(
        method,
        directive,
        file,
        meta,
      ),
      'x-amz-meta-status': this.getDefaultStatus(meta, method),
    };

    const bucketUrl = _.isFunction(directive.bucketUrl)
      ? directive.bucketUrl(directive.bucket, directive.region)
      : directive.bucketUrl;

    const downloadUrl = [directive.cdn || bucketUrl, payload.key]
      .map(part => part.replace(/\/+$/, ''))
      .join('/');

    this.applySignature(payload, policy, directive);

    return {
      upload: bucketUrl,
      download: downloadUrl,
      postData: [{ name: 'key', value: payload.key }].concat(
        _.chain(payload)
          .omit('key')
          .map(
            (value, name) =>
              !_.isUndefined(value) && {
                name,
                value,
              },
          )
          .compact()
          .value(),
      ),
    };
  },

  /** Applies signature an upload payload
   *
   * @param {Object} payload - Data to be upload along with file
   * @param {Slingshot.StoragePolicy} policy
   * @param {Directive} directive
   */

  applySignature(payload, policy, directive) {
    const now = new Date();

    const today =
      now.getUTCFullYear() +
      formatNumber(now.getUTCMonth() + 1, 2) +
      formatNumber(now.getUTCDate(), 2);

    const service = 's3';

    _.extend(payload, {
      'x-amz-algorithm': 'AWS4-HMAC-SHA256',
      'x-amz-credential': [
        directive[this.accessId],
        today,
        directive.region,
        service,
        'aws4_request',
      ].join('/'),
      'x-amz-date': `${today}T000000Z`,
    });

    const matchedPolicy = policy.match(payload);
    const base64Policy = matchedPolicy.stringify();

    payload.policy = base64Policy;
    payload['x-amz-signature'] = this.signAwsV4(
      payload.policy,
      directive[this.secretKey],
      today,
      directive.region,
      service,
    );
  },

  /** Generate a AWS Signature Version 4
   *
   * @param {String} policy - Base64 encoded policy to sign.
   * @param {String} secretKey - AWSSecretAccessKey
   * @param {String} date - Signature date (yyyymmdd)
   * @param {String} region - AWS Data-Center region
   * @param {String} service - type of service to use
   * @returns {String} hex encoded HMAC-256 signature
   */

  signAwsV4(policy, secretKey, date, region, service) {
    const dateKey = hmac256(`AWS4${secretKey}`, date);
    const dateRegionKey = hmac256(dateKey, region);
    const dateRegionServiceKey = hmac256(dateRegionKey, service);
    const signingKey = hmac256(dateRegionServiceKey, 'aws4_request');

    return hmac256(signingKey, policy, 'hex');
  },
};

export default exoscaleStorageService;
