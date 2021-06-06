<template>
  <div>
    <section class="main-content">
      <navbar v-if="$route.name !== 'Camera'" />
      <div>
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Navbar from '~/components/Navbar'

export default {
  components: { Navbar },
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' },
        },
        {
          title: 'Camera',
          icon: 'camera',
          to: { name: 'Camera' },
        },
      ],
    }
  },

  computed: {
    ...mapState(['selectedAccount', 'chainId']),
  },

  watch: {
    selectedAccount: {
      immediate: true,
      async handler(newAccount) {
        if (this.$web3.currentProvider) {
          const { accounts, chainId, connected } = this.$web3.currentProvider
          if (connected && accounts && chainId) {
            this.setSelectedAccount(accounts[0])
            await this.$store.dispatch('reverseResolveAddress', newAccount)
          }
        }
      },
    },
    chainId: {
      immediate: true,
      async handler(newChainId) {
        if (this.$web3.currentProvider) {
          const { accounts, chainId, connected } = this.$web3.currentProvider
          if (connected && accounts && chainId) {
            this.setChainId(newChainId)
            await this.$store.dispatch('reverseResolveAddress', accounts[0])
          }
        }
      },
    },
  },

  mounted() {
    if (this.$web3.currentProvider && this.$web3.currentProvider.wc) {
      this.$web3.currentProvider.wc.updateSession(
        this.$web3.currentProvider.wc.session
      )

      this.$web3.currentProvider.on('accountsChanged', (accounts) => {
        console.log('ACCOUNTS_CHANGED: ', accounts)
        this.setSelectedAccount(accounts[0])
      })

      this.$web3.currentProvider.on('chainChanged', (chainId) => {
        console.log('CHAIN_ID_CHANGE: ', chainId)
        this.setChainId(chainId)
      })

      this.$web3.currentProvider.on('disconnect', (code, reason) => {
        console.log('DISCONNECTED: ', { code, reason })
        this.setSelectedAccount(null)
        this.setChainId(null)
        this.setSelectedAccountEnsName(null)
        // this.$router.go(0)
      })

      this.$web3.currentProvider.wc.on('session_update', (error, payload) => {
        console.log('SESSION_UPDATE')
        if (error) {
          console.error(error)
        }
        console.log('PAYLOAD: ', payload)
      })

      this.$web3.currentProvider.on('connect', (info) => {
        console.log('ON_CONNECT')
        console.log(info)
      })
    }
  },

  destroyed() {
    // this.$web3.currentProvider.removeAllListeners()
  },

  methods: {
    ...mapMutations([
      'setChainId',
      'setSelectedAccount',
      'setSelectedAccountEnsName',
      'disableConnectButton',
      'resetState',
    ]),
  },
}
</script>
