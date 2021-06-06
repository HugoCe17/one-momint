import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default async function (context, inject) {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '07c05b5d099c4ad5b5d71ce38fc010e3',
      },
    },
    // torus: {
    //   package: Torus
    // },
    // fortmatic: {
    //   package: Fortmatic,
    //   options: {
    //     key: process.env.REACT_APP_FORTMATIC_KEY
    //   }
    // },
    // authereum: {
    //   package: Authereum
    // },
    // bitski: {
    //   package: Bitski,
    //   options: {
    //     clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
    //     callbackUrl: window.location.href + "bitski-callback.html"
    //   }
    // }
  }

  const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: false, // optional
    disableInjectedProvider: false, // optional
    providerOptions, // required
  })

  const provider = await web3Modal
    .connect()
    .then((provider) => provider)
    .catch((error) => console.error(error))

  inject('web3', new Web3(provider))
}
