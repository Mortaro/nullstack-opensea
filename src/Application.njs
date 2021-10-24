import Nullstack from 'nullstack';
import Collection from './Collection';
import MetaMask from './MetaMask';
import Web3 from 'web3/dist/web3.min.js';
import { OpenSeaPort } from 'opensea-js';

class Application extends Nullstack {

  prepare(context) {
    context.wallet = { address: undefined, balance: 0 }
  }

  async hydrate(context) {
    const { networkName } = context.settings
    context._web3 = new Web3(Web3.givenProvider);
    context._seaport = new OpenSeaPort(Web3.givenProvider, { networkName })
  }

  render() {
    return (
      <main>
        <MetaMask />
        <Collection route="/collection/:slug" />
      </main>
    )
  }

}

export default Application;