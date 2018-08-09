import crypto from 'crypto';
import { OBJECT_STORAGE_PATH, OBJECT_STORAGE_REGION } from '../fileConstants';

class ObjectStorageService {
  deleteObject = key => this.makeRequestObjectStorage('DELETE')(key);

  getObject = key => this.makeRequestObjectStorage('GET')(key);

  headObject = key => this.makeRequestObjectStorage('HEAD')(key);

  makeRequestObjectStorage = method => key =>
    fetch(`${OBJECT_STORAGE_PATH}/${key}`, {
      method,
      headers: {
        Date: new Date(),
        Authorization: this.createAuthorization(),
      },
    });

  createAuthorization = (apikey, signature) => `AWS${apikey}:${signature}`;

  createSignature = (payload, policy, directive) => {
    const now = new Date();

    const today = now.getUTCFullYear()
      + this.formatNumber(now.getUTCMonth() + 1, 2)
      + this.formatNumber(now.getUTCDate(), 2);

    const service = 's3';

    return {
      ...payload,
      'x-amz-algorithm': 'AWS4-HMAC-SHA256',
      'x-amz-credential': [
        directive[this.accessId],
        today,
        OBJECT_STORAGE_REGION,
        service,
        'aws4_request',
      ].join('/'),
      'x-amz-date': `${today}T000000Z`,
      policy: policy.match(payload).stringify(),
      'x-amz-signature': this.signAwsV4(
        payload.policy,
        directive[this.secretKey],
        today,
        OBJECT_STORAGE_REGION,
        service,
      ),
    };
  };

  formatNumber = (num, digits) => {
    const string = String(num);

    return Array(digits - string.length + 1)
      .join('0')
      .concat(string);
  };

  hmac256 = (key, data, encoding) =>
    crypto
      .createHmac('sha256', key)
      .update(Buffer.from(data, 'utf-8'))
      .digest(encoding);

  signAwsV4 = (policy, secretKey, date, region, service) => {
    const dateKey = this.hmac256(`AWS4${secretKey}`, date);
    const dateRegionKey = this.hmac256(dateKey, region);
    const dateRegionServiceKey = this.hmac256(dateRegionKey, service);
    const signingKey = this.hmac256(dateRegionServiceKey, 'aws4_request');

    return this.hmac256(signingKey, policy, 'hex');
  };
}

export default new ObjectStorageService();
