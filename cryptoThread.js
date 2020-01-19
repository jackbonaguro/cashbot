import './shim';
import { self } from 'react-native-threads';
import KeyDerivation from './controllers/keyderivation';

let count = 0;

self.onmessage = message => {
  console.log(`THREAD: got message ${message}`);

  count++;

  self.postMessage(`Message #${count} from worker thread!`);
  KeyDerivation.deriveXPubFromXPriv('xprv9wHokC2KXdTSpEepFcu53hMDUHYfAtTaLEJEMyxBPAMf78hJg17WhL5FyeDUQH5KWmGjGgEb2j74gsZqgupWpPbZgP6uFmP8MYEy5BNbyET').then((xpub) => {
    self.postMessage(xpub);
  })
};
