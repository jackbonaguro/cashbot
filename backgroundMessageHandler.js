// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

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

export default async (message: RemoteMessage) => {
  respondToMessage('1HSqyCH5mF6jbRcySed5ds8hxLEiNDDevm').then(responseBody => {
    // Keep count of requests, check restrictions and bucket
  }).catch(err => {
    // Notify user something is wrong with their configuration
  });

  return Promise.resolve();
}