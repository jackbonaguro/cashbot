import KeyDerivation from './keyderivation';
import { bitcore as Bitcore } from 'bitcore-mnemonic';

const baseUrl = 'http://localhost:3001';

const signPayload = (signingXPriv, payload) => {
  return KeyDerivation.signMessageXPriv(signingXPriv, JSON.stringify(payload));
};

const Api = {
  addressRequestHook: async (address, callback) => {
    fetch(`${baseUrl}/respond`, {
      method: 'POST',
      body: `{ "address": "${address}" }`,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    }).then(response => response.json()).then(json => {
      return callback(null, json);
    }).catch(callback);
  },
  register: async (params, callback) => {
    const {
      signingXPriv,
      email,
      fcmToken,
    } = params;

    const xPub = KeyDerivation.deriveXPubFromXPriv(signingXPriv);
    const payload = {
      email,
      fcmToken,
      xPub
    };
    const sig = signPayload(signingXPriv, payload);

    // console.log(Bitcore.HDPublicKey(xPub).publicKey.toAddress('testnet').toString());
    // console.log(JSON.stringify(payload));
    // console.log(sig);

    fetch(`${baseUrl}/register?s=${encodeURIComponent(sig)}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    }).then(response => {
      return response.json();
    }).then(json => {
      return callback(null, json);
    }).catch((err) => {
      return callback(err);
    });
  }
};

export default Api;
