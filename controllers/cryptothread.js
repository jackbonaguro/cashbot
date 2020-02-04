import EventEmitter from 'EventEmitter';
import { Thread } from "react-native-threads";
import Mnemonic from 'bitcore-mnemonic';

/*
* CryptoThread Controller
*
* Spin up a new process to do the crypto heavy lifting,
* and promisify ipc calls to it.
* */

let thread;
let threadEmitter;
//let tasks = [];
let taskCounter = 0; // TODO: Make something that won't overflow

const prepMessage = (method, data) => {
  let task = {
    method,
    data,
    id: taskCounter
  };
  taskCounter++;
  //tasks.push(task);
  return task;
};

const messageGenerator = (method, data) => {
  let task = prepMessage(method, data);
  return Promise.race([
    new Promise((resolve, reject) => {
      thread.postMessage(JSON.stringify(task));
      // Await reply that matches id
      let messageHandler = threadEmitter.addListener('message', (message) => {
        if (message.id === task.id) {
          messageHandler.remove();
          if (message.err) {
            return reject(new Error(message.err));
          }
          return resolve(message.data);
        }
      });
    }),
    new Promise((_, reject) => {
      // Reject for timeout after 5 seconds
      setTimeout(() => {
        return reject(new Error(`Timeout on cryptoThread for task: ${JSON.stringify(task)}`));
      }, 10000);
    })
  ]);
};

const deriveAddress = (mnemonic, path) => {
  return messageGenerator('deriveAddress', { mnemonic: mnemonic.toString(), path }).then(data => data.address);
};
const deriveXPriv = (mnemonic, path) => {
  return messageGenerator('deriveXPriv', { mnemonic: mnemonic.toString(), path }).then(data => data.xpriv);
};
const deriveXPub = (mnemonic, path) => {
  return messageGenerator('deriveXPub', { mnemonic: mnemonic.toString(), path }).then(data => data.xpub);
};
const signMessage = (mnemonic, path, message) => {
  return messageGenerator('signMessage', { mnemonic: mnemonic.toString(), path, message }).then(data => data.sig);
};

export default {
  initializeCryptoThread: () => {
    return new Promise((resolve, reject) => {
      if (__DEV__) {
        thread = new Thread('../cryptoThread.js');
      } else {
        // Prod uses the absolute path (see bundle-threads script)
        thread = new Thread('./cryptoThread.js');
      }
      threadEmitter = new EventEmitter();
      thread.onmessage = (m) => {
        const message = JSON.parse(m);
        if (message.err && !message.id) {
          // Log global error since it will not be handled
          console.error(new Error(message.err));
        }
        threadEmitter.emit('message', message);
      };
      resolve();
    });
  },
  deriveReceiveAddress: (mnemonic, index) => {
    return deriveAddress(mnemonic, `m/44'/1'/0'/0/${index}`);
  },
  deriveSigningAddress: (mnemonic, index) => {
    return deriveAddress(mnemonic, `m/44'/1'/1'/0/${index}`);
  },
  deriveAddress,
  deriveSigningXPriv: (mnemonic) => {
    return deriveXPriv(mnemonic, `m/44'/1'/1'/0`);
  },
  deriveSigningXPub: (mnemonic) => {
    return deriveXPub(mnemonic, `m/44'/1'/1'/0`);
  },
  deriveXPriv,
  deriveXPub,
  deriveXPubFromXPriv: (xpriv) => {
    return messageGenerator('deriveXPubFromXPriv', { xpriv }).then(data => data.xpub);
  },
  generateSeed: () => {
    return messageGenerator('generateSeed', {}).then(data => new Mnemonic(data.seed));
  },
  signReceiveMessage: (mnemonic, index, message) => {
    return signMessage(mnemonic, `m/44'/1'/0'/0/${index}`, message);
  },
  signSigningMessage: (mnemonic, index, message) => {
    return signMessage(mnemonic, `m/44'/1'/1'/0/${index}`, message);
  },
  signMessageXPriv: (xpriv, message) => {
    return messageGenerator('signMessageXPriv', { xpriv, message }).then(data => data.sig);
  },
  signMessage,
  terminate: () => {
    thread.terminate();
  }
};
