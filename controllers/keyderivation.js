import {generateSecureRandom} from "react-native-securerandom";
import Message from 'bitcore-message';
import Mnemonic, { bitcore as Bitcore } from "bitcore-mnemonic";

let deriveAddress = (mnemonic, path) => {
  // Will return address string
  var xpriv = mnemonic.toHDPrivateKey();
  const derivedXPriv = xpriv.derive(path);
  const pubKey = derivedXPriv.publicKey;
  const address = pubKey.toAddress('testnet');
  return `${address}`;
};

let deriveXPub = (mnemonic, path) => {
  // Will return address string
  var xpriv = mnemonic.toHDPrivateKey();
  const derivedXPriv = xpriv.derive(path);
  const hdPublicKey = derivedXPriv.hdPublicKey;
  return `${hdPublicKey}`;
};
let deriveXPriv = (mnemonic, path) => {
  // Will return address string
  var xpriv = mnemonic.toHDPrivateKey();
  const derivedXPriv = xpriv.derive(path);
  return `${derivedXPriv}`;
};
let deriveXPubFromXPriv = (xpriv) => {
  var hdPrivateKey = Bitcore.HDPrivateKey(xpriv);
  const hdPublicKey = hdPrivateKey.hdPublicKey;
  return `${hdPublicKey}`;
};

let signMessage = (mnemonic, path, message) => {
  var xpriv = mnemonic.toHDPrivateKey();
  const derivedXPriv = xpriv.derive(path);
  return Message(message).sign(derivedXPriv.privateKey);
};

let signMessageXPriv = (xpriv, message) => {
  var hdPrivateKey = Bitcore.HDPrivateKey(xpriv);
  console.log('xpriv: '+hdPrivateKey);
  console.log('message: '+message);
  let sig = Message(message).sign(hdPrivateKey.privateKey);
  console.log('Sig: '+sig);
  return sig;
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
  generateSeedAsync: async (beforeCallback, afterCallback) => {
    // 16 bytes = 128 bits, yielding a 12-word mnemonic (compatible with most wallets)
    // https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
    generateSecureRandom(16).then(randomBytes => {
      // Successfully generates new BIP39 Mnemonic from native secure RNG
      let mnemonic = Mnemonic.fromSeed(new Buffer(randomBytes), Mnemonic.Words.ENGLISH);
      //console.log(mnemonic);
      //this.props.dispatch(setSeed(mnemonic));
      afterCallback(mnemonic)
    });
  },
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
