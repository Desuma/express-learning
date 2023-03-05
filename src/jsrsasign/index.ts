import jsrsasign from 'jsrsasign';
import { assign } from 'lodash';

import { isDev } from '~/util';

const { KEYUTIL, KJUR } = jsrsasign;
const rsaKeypair: any = {};
const alg = 'PKCS8PRV';

export const createRsa = () => {
  const long = isDev() ? 32 : 1024
  const keypair = KEYUTIL.generateKeypair('RSA', long);

  assign(rsaKeypair, keypair);

  return keypair;
};

export const getPublicKey = () => KEYUTIL.getPEM(rsaKeypair.pubKeyObj);

export const getPrviteKey = () => KEYUTIL.getPEM(rsaKeypair.prvKeyObj, alg);

export const rsaEncrypt = (data: string) => {
  const pubKey = getPublicKey();

  return KJUR.crypto.Cipher.encrypt(data, pubKey, alg);
};

export const rsaDecrypt = (data: string) => {
  const prviKey = getPrviteKey();

  return KJUR.crypto.Cipher.decrypt(data, prviKey, alg);
};

export default {
  createRsa,
  getPublicKey,
  getPrviteKey,
  rsaEncrypt,
  rsaDecrypt,
}