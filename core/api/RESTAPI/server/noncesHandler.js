import moment from 'moment';

export const NONCE_TTL = 30;
let nonces = {
  testNonce: 1, // Used in tests
};

export const deleteNonce = (nonce) => {
  nonces = Object.keys(nonces).reduce((newNonces, key) => {
    if (key !== nonce) {
      return { ...newNonces, [key]: nonces[key] };
    }
    return newNonces;
  }, {});
};

export const nonceExists = (nonce) => {
  const now = moment().unix();

  // First delete all old nonces
  Object.keys(nonces).forEach((key) => {
    if (now - nonces[key] > NONCE_TTL) {
      deleteNonce(key);
    }
  });

  return nonces[nonce] !== undefined;
};

export const addNonce = (nonce) => {
  const now = moment().unix();
  nonces[nonce] = now;
};
