import { ActionTree, MutationTree } from 'vuex'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
// import VuexPersistence from 'vuex-persist'
import detectEthereumProvider from '@metamask/detect-provider'

import { SnackbarProgrammatic as Snackbar } from 'buefy'

export const resetWalletConnector = (connector: WalletConnectConnector) => {
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
      provider: await detectEthereumProvider(),
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
  async connectToWallet(context) {
    const { accounts, chainId, connected } = await this.app.$web3
      .currentProvider.wc

    if (connected && chainId !== 4) {
      return Snackbar.open({
        message: 'Please connect to Rinkeby',
        type: 'is-warning',
        position: 'is-top',
      })
    }

    if (connected && accounts[0]) {
      return Snackbar.open({
        actionText: 'OK',
        message: `Connected as: \n\n ${accounts[0]} chainId: ${chainId}`,
        type: 'is-success',
        position: 'is-top',
        duration: 6000,
        queue: false,
      })
    }

    try {
      if (!this.app.$web3.currentProvider.wc.connected) {
        const item = await this.app.$web3.currentProvider.wc.createSession()
        console.log(item)
      }
    } catch (error) {
      console.error(error)
    }
  },
  async disconnectWallet() {
    if (this.app.$web3.currentProvider.wc.connected) {
      console.log('DISCONNECT')
      await this.app.$web3.currentProvider.wc.killSession()
    }
  },
}

// export const plugins = [vuexLocal.plugin]
