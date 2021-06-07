import { ActionTree, MutationTree } from 'vuex'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
// import VuexPersistence from 'vuex-persist'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import detectProvider from '@metamask/detect-provider'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

export const resetWalletConnector = (connector: any) => {
  if (connector && connector.walletConnectProvider?.wc?.uri) {
    connector.walletConnectProvider = undefined
  }
}

export const state = () => ({
  selectedAccount: null,
  selectedAccountEnsName: null,
  chainId: null,
  nftCollection: [],
  gallery: [],
})

export const getDefaultState = () => ({
  selectedAccount: null,
  selectedAccountEnsName: null,
  chainId: null,
  nftCollection: [],
  gallery: [],
})

export type RootState = ReturnType<typeof state>

// const vuexLocal = new VuexPersistence<RootState>({
//   storage: window.localStorage,
// })

export const mutations: MutationTree<RootState> = {
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
  setChainId(state, id) {
    state.chainId = id
  },
  setSelectedAccount(state, selectedAccount) {
    state.selectedAccount = selectedAccount
  },
  setSelectedAccountEnsName(state, ensName) {
    state.selectedAccountEnsName = ensName
  },
  setNFTCollection(state, collection) {
    state.nftCollection = collection
  },
  pushToNFTCollection(
    state: { selectedAccount: string | null; nftCollection: any[] },
    nft
  ) {
    state.nftCollection = state.nftCollection.concat([nft])
  },
  removeFromNFTCollectionByIndex(state, index) {
    state.nftCollection.splice(index, 1)
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async reverseResolveAddress({ commit }, address) {
    if (!address) return commit('setSelectedAccountEnsName', null)

    console.log(address)

    const ens = await new ENS({
      provider: await detectProvider(),
      ensAddress: getEnsAddress(4),
    })

    console.log({ ENS: await ens.getName(address) })

    const ensName = await ens.getName(address)
    const checked = await ens.name(ensName.name).getAddress()
    if (address.toLowerCase() !== checked.toLowerCase()) {
      commit('setSelectedAccountEnsName', null)
    } else {
      commit('setSelectedAccountEnsName', ensName.name)
    }
  },

  async connectToWallet({ commit, state }) {
    console.log(this.app.$web3.currentProvider)
    if (!this.app.$web3.currentProvider) return
    const { selectedAddress, chainId } = this.app.$web3.currentProvider
    console.log('CHAINID: ', chainId)
    if (Number(chainId) !== 4) {
      return Snackbar.open({
        message: 'Please connect to Rinkeby',
        type: 'is-warning',
        position: 'is-top',
      })
    }

    if (selectedAddress) {
      return Snackbar.open({
        actionText: 'OK',
        message: `Connected as: \n\n ${selectedAddress} chainId: ${Number(
          chainId
        )}`,
        type: 'is-success',
        position: 'is-top',
        duration: 6000,
        queue: false,
      })
    }

    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: '07c05b5d099c4ad5b5d71ce38fc010e3',
          },
        },
      }

      const web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: false, // optional
        disableInjectedProvider: true, // optional
        providerOptions, // required
      })

      const provider = await web3Modal
        .connect()
        .then((provider) => provider)
        .catch((error) => console.error(error))

      console.log('PROVIDER: ', provider)
      await this.app.$web3.setProvider(provider)

      this.app.$web3.eth.extend({
        methods: [
          {
            name: 'chainId',
            call: 'eth_chainId',
            outputFormatter: this.app.$web3.utils.hexToNumber,
          },
        ],
      })

      if (this.app.$web3.currentProvider) {
        console.log('INIT_EVENTS')
        this.app.$web3.currentProvider.on(
          'accountsChanged',
          (accounts: any) => {
            console.log('ACCOUNTS_CHANGED: ', accounts)
            commit('setSelectedAccount', accounts[0])
          }
        )

        this.app.$web3.currentProvider.on(
          'chainChanged',
          (chainId: string | null) => {
            console.log('CHAIN_ID_CHANGE: ', chainId)
            commit('setChainId', chainId)
          }
        )

        this.app.$web3.currentProvider.on(
          'disconnect',
          (code: string, reason: string) => {
            console.log('DISCONNECTED: ', { code, reason })
            commit('setSelectedAccount', null)
            commit('setChainId', null)
            commit('setSelectedAccountEnsName', null)
            // this.$router.go(0)
          }
        )

        this.app.$web3.currentProvider.on(
          'connect',
          (info: { chainId: number }) => {
            console.log('ON_CONNECT')
            console.log(info)
          }
        )

        if (this.app.$web3.currentProvider.wc) {
          this.app.$web3.currentProvider.wc.on(
            'session_update',
            (error: any, payload: any) => {
              console.log('SESSION_UPDATE')
              if (error) {
                console.error(error)
              }
              console.log('PAYLOAD: ', payload)
            }
          )
        }
      }
    } catch (error) {
      console.error(error)
    }
  },

  async disconnectWallet() {
    if (this.app.$web3.currentProvider.connected) {
      console.log('DISCONNECT')
      await this.app.$web3.currentProvider.disconnect()
    }
  },
}

// export const plugins = [vuexLocal.plugin]
