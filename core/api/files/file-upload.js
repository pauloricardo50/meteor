import crypto from 'crypto';

const config = {
  signerUrl: '',
  aws_key: '',
  bucket: 'e-potek-files',
  cloudfront: true,
  computeContentMd5: true,
  cryptoMd5Method: data =>
    crypto
      .createHash('md5')
      .update(data)
      .digest('base64'),
};
