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
      async handler(newAccount, oldAccount) {
        const { accounts, chainId, connected } = this.$connector
        if (newAccount !== oldAccount && connected && accounts && chainId) {
          this.setSelectedAccount(accounts[0])
          await this.$store.dispatch('reverseResolveAddress', newAccount)
          await this.$connector.updateSession({
            accounts,
            chainId,
          })
        }
      },
    },
    chainId: {
      immediate: true,
      async handler(newChainId, oldChainId) {
        const { accounts, chainId, connected } = this.$connector
        if (newChainId !== oldChainId && connected && accounts && chainId) {
          this.setSelectedAccount(accounts[0])
          await this.$store.dispatch('reverseResolveAddress', accounts[0])
          await this.$connector.updateSession({
            accounts,
            chainId: newChainId,
          })
        }
      },
    },
  },

  mounted() {
    this.$connector.on('connect', (error, payload) => {
      if (error) {
        return console.error(error)
      }
      console.log('CONNECTED: ', payload)
      const { accounts, chainId } = payload.params[0]
      this.setSelectedAccount(accounts[0])
      this.setChainId(chainId)
    })

    this.$connector.on('session_update', (error, payload) => {
      if (error) {
        return console.error(error)
      }
      console.log('SESSION_UPDATED: ', payload)
      const { accounts, chainId } = payload.params[0]
      this.setSelectedAccount(accounts[0])
      this.setChainId(chainId)
    })

    this.$connector.on('disconnect', () => {
      this.setSelectedAccount(null)
      this.setChainId(null)
      this.setSelectedAccountEnsName(null)
      this.$router.go(0)
    })
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
