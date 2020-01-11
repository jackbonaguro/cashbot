import {generateSecureRandom} from "react-native-securerandom";
import Mnemonic from "bitcore-mnemonic";
import {setSeed} from "../actions";

export default KeyDerivation = {
  deriveReceiveAddress: (mnemonic, index) => {
    // Will return address string
    var xpriv = mnemonic.toHDPrivateKey();

    const derivationPath = `m/44'/1'/0'/0/${index}`;
    const derivedXPriv = xpriv.derive(derivationPath);
    const pubKey = derivedXPriv.publicKey;
    const address = pubKey.toAddress();
    return `${address}`;
  },
  deriveAddress: (mnemonic, path, index) => {
    // Will return address string
    var xpriv = mnemonic.toHDPrivateKey();
    const derivedXPriv = xpriv.derive(path);
    const pubKey = derivedXPriv.publicKey;
    const address = pubKey.toAddress();
    return `${address}`;
  },
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
};
