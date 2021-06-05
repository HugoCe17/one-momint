import { ActionTree, MutationTree } from 'vuex'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import VuexPersistence from 'vuex-persist'

import { SnackbarProgrammatic as Snackbar } from 'buefy'

const stringifyState = (state: any) => {
  return JSON.stringify({ ...state })
}

const syncStateToStorage = (state: any) => {
  if (state.selectedAccount !== null) {
    localStorage.setItem(state.selectedAccount, stringifyState(state))
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

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
})

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
    syncStateToStorage(state)
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
      provider: this.app.$web3.currentProvider,
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
    console.log('CONTEXT: ', context)
    console.log('THIS_CONTEXT: ', this)
    const { accounts, chainId, connected } = await this.app.$web3
      .currentProvider
    console.log('CONNECTED ?: ', connected)
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
      if (!this.app.$web3.currentProvider.connected) {
        console.log('Setting provider')
        await this.app.$web3.currentProvider.enable()
      }
    } catch (error) {
      console.error(error)
    }
  },
  disconnectWallet() {
    if (this.app.$web3.currentProvider.connected) {
      console.log('DISCONNECT')
      this.app.$web3.currentProvider.disconnect()
    }
  },
}

export const plugins = [vuexLocal.plugin]
