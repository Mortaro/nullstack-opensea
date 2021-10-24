import Nullstack from 'nullstack';
import Web3 from 'web3/dist/web3.min.js'

class Collection extends Nullstack {

  prepare({ project, page, params }) {
    page.locale = 'en-US'
    page.title = `${project.name} - ${params.slug}`
    page.description = `${project.name} was made with Nullstack`
  }

  async hydrate({ params, _seaport }) {
    const { assets } = await _seaport.api.getAssets({ collection: params.slug })
    this.assets = assets
  }

  async buy({ _seaport, wallet, asset }) {
    const order = await _seaport.api.getOrder({
      side: 1,
      asset_contract_address: asset.assetContract.address,
      token_id: asset.tokenId
    })
    const transactionHash = await _seaport.fulfillOrder({
      order,
      accountAddress: wallet.address
    })
    console.log({ transactionHash })
  }

  renderAsset({ wallet, asset }) {
    const price = +asset.sellOrders?.[0]?.currentPrice
    const formattedPrice = price ? Web3.utils.fromWei(price.toString(), 'ether') : 0
    const owner = asset.lastSale?.transaction?.fromAccount?.address || asset.sellOrders?.[0]?.maker
    const owned = owner === wallet.address
    return (
      <div>
        <img src={asset.imageUrlThumbnail} alt={asset.name} />
        <h2> {asset.name} </h2>
        <p> {owner} {owned && '(you)'} </p>
        {!!price && !owned &&
          <button onclick={this.buy} asset={asset}>
            Buy for {formattedPrice}eth on {owner ? 'secondary' : 'primary'}
          </button>
        }
        {!!price && owned &&
          <span> For sale {formattedPrice}eth </span>
        }
      </div>
    )
  }

  render({ params }) {
    return (
      <section>
        <h1> {params.slug} </h1>
        <div>
          {this.assets?.map((asset) => <Asset asset={asset} />)}
        </div>
      </section>
    )
  }

}

export default Collection;