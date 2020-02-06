import {generateSecureRandom} from "react-native-securerandom";
import Message from 'bitcore-message';
import Mnemonic, { bitcore as Bitcore } from "bitcore-mnemonic";

let deriveAddress = (mnemonic, path) => {
  return new Promise((resolve, reject) => {
    try {
      // Will return address string
      var xpriv = mnemonic.toHDPrivateKey();
      const derivedXPriv = xpriv.derive(path);
      const pubKey = derivedXPriv.publicKey;
      const address = pubKey.toAddress('testnet');
      return resolve(`${address}`);
    } catch (err) {
      return reject(err);
    }
  });
};

let deriveXPub = (mnemonic, path) => {
  return new Promise((resolve, reject) => {
    try {
      // Will return address string
      var xpriv = mnemonic.toHDPrivateKey();
      const derivedXPriv = xpriv.derive(path);
      const hdPublicKey = derivedXPriv.hdPublicKey;
      return resolve(`${hdPublicKey}`);
    } catch (err) {
      return reject(err);
    }
  });
};
let deriveXPriv = (mnemonic, path) => {
  return new Promise((resolve, reject) => {
    try {
      // Will return address string
      var xpriv = mnemonic.toHDPrivateKey();
      const derivedXPriv = xpriv.derive(path);
      return resolve(`${derivedXPriv}`);
    } catch (err) {
      return reject(err);
    }
  });
};
let deriveXPubFromXPriv = (xpriv) => {
  return new Promise((resolve, reject) => {
    try {
      var hdPrivateKey = Bitcore.HDPrivateKey(xpriv);
      const hdPublicKey = hdPrivateKey.hdPublicKey;
      return resolve(`${hdPublicKey}`);
    } catch (err) {
      return reject(err);
    }
  });
};

let signMessage = (mnemonic, path, message) => {
  return new Promise((resolve, reject) => {
    try {
      var xpriv = mnemonic.toHDPrivateKey();
      const derivedXPriv = xpriv.derive(path);
      return resolve(Message(message).sign(derivedXPriv.privateKey));
    } catch (err) {
      return reject(err);
    }
  });
};

let signMessageXPriv = (xpriv, message) => {
  return new Promise((resolve, reject) => {
    try {
      var hdPrivateKey = Bitcore.HDPrivateKey(xpriv);
      let sig = Message(message).sign(hdPrivateKey.privateKey);
      return resolve(sig);
    } catch (err) {
      return reject(err);
    }
  });
};

const generateSeed = () => {
  return new Promise((resolve, reject) => {
    // 16 bytes = 128 bits, yielding a 12-word mnemonic (compatible with most wallets)
    // https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki

    generateSecureRandom(16).then(randomBytes => {
      return resolve('5678');
      // Successfully generates new BIP39 Mnemonic from native secure RNG
      try {
        let mnemonic = Mnemonic.fromSeed(new Buffer(randomBytes), Mnemonic.Words.ENGLISH);

        //this.props.dispatch(setSeed(mnemonic));
        return resolve(mnemonic);
      } catch (err) {
        return reject(err);
      }
    });
  });
};

export default KeyDerivation = {
  deriveReceiveAddress: (mnemonic, index) => {
    return deriveAddress(mnemonic, `m/44'/1'/0'/0/${index}`);
  },
  deriveSigningAddress: (mnemonic, index) => {
    return deriveAddress(mnemonic, `m/44'/1'/1'/0/${index}`);
  },
  deriveSigningXPriv: (mnemonic) => {
    return deriveXPriv(mnemonic, `m/44'/1'/1'/0`);
  },
  deriveSigningXPub: (mnemonic) => {
    return deriveXPub(mnemonic, `m/44'/1'/1'/0`);
  },
  deriveXPub,
  deriveXPriv,
  deriveXPubFromXPriv,
  deriveAddress,
  generateSeed,
  //deriveAddressAsync: async (mnemonic, index, beforeCallback, afterCallback) => {
  //}
  signReceiveMessage: (mnemonic, index, message) => {
    return signMessage(mnemonic, `m/44'/1'/0'/0/${index}`, message);
  },
  signSigningMessage: (mnemonic, index, message) => {
    return signMessage(mnemonic, `m/44'/1'/1'/0/${index}`, message);
  },
  signMessage,
  signMessageXPriv,
};
