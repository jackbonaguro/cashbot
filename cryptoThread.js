import './shim';
import { self } from 'react-native-threads';
import KeyDerivation from './controllers/keyderivation';
import Mnemonic from 'bitcore-mnemonic';

let count = 0;

self.onmessage = m => {
  let message;
  try {
    message = JSON.parse(m);
    //throw new Error(`${message.method}`);
    if ((typeof message.id) === 'undefined') {
      throw new Error(`CryptoThread message has no id`);
    }
  } catch (e) {
    // We don't even have id, so message is garbage. Emit for global error handler
    return self.postMessage(JSON.stringify({
      err: e.message
    }));
  }

  try {
    switch (message.method) {
      case 'deriveXPubFromXPriv': {
        KeyDerivation.deriveXPubFromXPriv(message.data.xpriv).then((xpub) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              xpub
            }
          }));
        });
        return;
      }
      case 'deriveAddress': {
        return KeyDerivation.deriveAddress(new Mnemonic(message.data.mnemonic), message.data.path).then((address) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              address
            }
          }));
        });
        return;
      }
      default: {
        throw new Error(`CryptoThread message has invalid method: ${message.method}`);
      }
    }
  } catch (e) {
    return self.postMessage(JSON.stringify({
      id: message.id,
      err: e.message
    }));
  }
};
