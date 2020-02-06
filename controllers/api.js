import CryptoThread from './cryptothread';

const baseUrl = 'http://localhost:3001';

const signPayload = (signingXPriv, payload) => {
  return CryptoThread.signMessageXPriv(signingXPriv, JSON.stringify(payload));
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

    const xPub = await CryptoThread.deriveXPubFromXPriv(signingXPriv);
    console.log(xPub);
    const payload = {
      email,
      fcmToken,
      xPub
    };
    const sig = await signPayload(signingXPriv, payload);

    console.log(sig);

    fetch(`${baseUrl}/user/register?s=${encodeURIComponent(sig)}`, {
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
  },
  getUser: async (params, callback) => {
    const {
      signingXPriv,
      email,
    } = params;

    const xPub = await CryptoThread.deriveXPubFromXPriv(signingXPriv);
    console.log(xPub);
    const payload = {
      email,
      xPub
    };
    const sig = await signPayload(signingXPriv, payload);

    console.log(sig);

    fetch(`${baseUrl}/user?s=${encodeURIComponent(sig)}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    }).then(response => {
      console.log(response);
      if (!response.ok) {
        console.error(new Error(response.statusText));
      }
      return response.json();
    }).then(json => {
      return callback(null, json);
    }).catch((err) => {
      return callback(err);
    });
  }
};

export default Api;
