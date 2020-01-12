// @flow
import firebase from 'react-native-firebase';

import store from './store';
import { incrementReceiveIndex, fetchReceiveIndex, fetchSeed } from './actions';
import KeyDerivation from './controllers/keyderivation';
import Api from './controllers/api';
import Storage from './controllers/storage';

async function respondToMessage(address) {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3001/respond', {
      method: 'POST',
      body: `{ "address": "${address}" }`,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    }).then(response => response.json()).then(json => {
      return resolve(json);
    }).catch(reject);
  });
}

export default async (message) => {
  // Can't rely on redux too much here since we need things to happen in a particular order;
  // thunks don't have callbacks since they expect a re-render

  Storage.fetchSeedAsync(() => {}, (seed) => {
    if (!seed) {
      return;
    }
    Storage.fetchReceiveIndexAsync(() => {}, (receiveIndex) => {
      if (!receiveIndex) {
        return;
      }
      Api.addressRequestHook(KeyDerivation.deriveReceiveAddress(seed, receiveIndex), (err, responseBody) => {
        if (err) {
          //console.error(err);
          return;
        }
        // Keep count of requests, check restrictions and bucket
        store.dispatch(incrementReceiveIndex(receiveIndex));
      });
    });
  });
}
