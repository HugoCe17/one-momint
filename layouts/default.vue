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
        const { accounts, chainId, connected } = this.$web3.currentProvider
        if (connected && accounts && chainId) {
          this.setSelectedAccount(accounts[0])
          await this.$store.dispatch('reverseResolveAddress', newAccount)
        }
      },
    },
    chainId: {
      immediate: true,
      async handler(newChainId) {
        const { accounts, chainId, connected } = this.$web3.currentProvider
        if (connected && accounts && chainId) {
          this.setChainId(newChainId)
          await this.$store.dispatch('reverseResolveAddress', accounts[0])
        }
      },
    },
  },

  mounted() {
    this.$web3.currentProvider.wc.on('connect', (error, payload) => {
      if (error) {
        return console.error(error)
      }
      console.log('CONNECTED_PAYLOAD: " ', payload)

      const { accounts, chainId } = payload.params[0]
      this.setSelectedAccount(accounts[0])

      this.setChainId(chainId)
    })

    this.$web3.currentProvider.wc.on('session_update', (error, payload) => {
      if (error) {
        return console.error(error)
      }
      console.log('SESSION_UPDATED: ', payload)

      const { accounts, chainId } = payload.params[0]
      this.setSelectedAccount(accounts[0])
      this.setChainId(chainId)
    })

    this.$web3.currentProvider.wc.on('disconnect', (code, reason) => {
      console.log('DISCONNECTED: ', { code, reason })
      this.setSelectedAccount(null)
      this.setChainId(null)
      this.setSelectedAccountEnsName(null)
      this.$router.go(0)
    })
  },

  destroyed() {
    this.$web3.currentProvider.removeAllListeners()
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
