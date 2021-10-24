import Nullstack from 'nullstack';
import MetaMaskOnboarding from '@metamask/onboarding'

class MetaMask extends Nullstack {

  async hydrate({ _web3, wallet }) {
    this._onboarding = new MetaMaskOnboarding()
    if (window.ethereum?.selectedAddress) {
      wallet.address = window.ethereum?.selectedAddress
      wallet.balance = await _web3.eth.getBalance(window.ethereum.selectedAddress)
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', async ([account]) => {
        wallet.address = account
        wallet.balance = account ? await _web3.eth.getBalance(account) : 0
      })
      this._onboarding.stopOnboarding();
    }
  }

  async connect() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      this.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else {
      this._onboarding.startOnboarding();
    }
  }

  render({ wallet }) {
    return (
      <div>
        {!wallet.address &&
          <button onclick={this.connect}> Connect </button>
        }
        {!!wallet.address &&
          <div>
            <span> address: {wallet.address} </span>
            <span> balance: {wallet.balance} </span>
          </div>
        }
      </div>
    )
  }

}

export default MetaMask;