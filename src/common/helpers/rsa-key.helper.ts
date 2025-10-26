import * as jose from 'node-jose';

type KeyPairOptions = {
  algorithm?: 'RS256' | 'RS384' | 'RS512';
  keySize?: number;
  kid?: string;
};

export class RsaKeyHelper {
  static async generateKeyPair({
    algorithm = 'RS256',
    keySize = 2048,
    kid,
  }: KeyPairOptions = {}) {
    const key = await jose.JWK.createKey('RSA', keySize, {
      alg: algorithm,
      use: 'sig',
      kid,
    });

    const privateKey = key.toPEM(true);
    const publicKey = key.toPEM(false);

    return {
      kid: key.kid,
      privateKey,
      publicKey,
    };
  }
}
