import EventEmitter from 'EventEmitter';
import { Thread } from "react-native-threads";

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
        return reject(new Error(`Timeout on cryptoThread for task: ${task}`));
      }, 5000);
    })
  ]);
};

export default {
  initializeCryptoThread: () => {
    return new Promise((resolve, reject) => {
      if (__DEV__) {
        thread = new Thread('../cryptoThread.js');
      } else {
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
  deriveAddress: (mnemonic, path) => {
    return messageGenerator('deriveAddress', { mnemonic, path }).then(data => data.address);
  },

  deriveXPubFromXPriv: (xpriv) => {
    return messageGenerator('deriveXPubFromXPriv', { xpriv }).then(data => data.xpub);
  },
  terminate: () => {
    thread.terminate();
  }
};
