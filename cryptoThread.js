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
        return KeyDerivation.deriveXPubFromXPriv(message.data.xpriv).then((xpub) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              xpub
            }
          }));
        });
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
      }
      case 'deriveXPriv': {
        return KeyDerivation.deriveXPriv(new Mnemonic(message.data.mnemonic), message.data.path).then((xpriv) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              xpriv
            }
          }));
        });
      }
      case 'deriveXPrivFromXPriv': {
        return KeyDerivation.deriveXPrivFromXPriv(message.data.xpriv, message.data.path).then((xpriv) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              xpriv
            }
          }));
        });
      }
      case 'deriveXPub': {
        return KeyDerivation.deriveXPub(new Mnemonic(message.data.mnemonic), message.data.path).then((xpriv) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              xpriv
            }
          }));
        });
      }
      case 'generateSeed': {
        KeyDerivation.generateSeed().then((seed) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              seed: seed.toString()
            }
          }));
        }).catch((err) => {
          throw err;
        });
        break;
      }
      case 'signMessage': {
        return KeyDerivation.signMessage(new Mnemonic(message.data.mnemonic), message.data.path, message.data.message).then((sig) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              sig
            }
          }));
        });
      }
      case 'signMessageXPriv': {
        return KeyDerivation.signMessageXPriv(message.data.xpriv, message.data.message).then((sig) => {
          self.postMessage(JSON.stringify({
            id: message.id,
            data: {
              sig
            }
          }));
        });
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
