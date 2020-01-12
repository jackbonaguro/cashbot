import store from './store';
import { incrementReceiveIndex, fetchReceiveIndex, fetchSeed } from './actions';
import KeyDerivation from './controllers/keyderivation';
import Api from './controllers/api';
import Storage from './controllers/storage';

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
          return;
        }
        // Keep count of requests, check restrictions and bucket
        store.dispatch(incrementReceiveIndex(receiveIndex));
      });
    });
  });
}
