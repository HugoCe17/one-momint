<template>
  <b-navbar :mobile-burger="false">
    <template #brand>
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }"
        :style="{
          'background-color': 'white',
        }"
      >
        <img :src="require('~/assets/brand-logo.png')" />
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item
        v-for="({ to, label }, index) in navItems"
        :key="index"
        tag="nuxt-link"
        :to="to"
      >
        {{ label }}
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            v-if="$web3.currentProvider.connected"
            class="is-secondary is-small"
            @click="$store.dispatch('disconnectWallet')"
          >
            Disconnect
          </b-button>
          <b-button
            :type="selectedAccount ? 'is-secondary' : 'is-primary'"
            @click="$store.dispatch('connectToWallet')"
            >{{ cBtnLabel }}</b-button
          >
          <b-button
            v-if="selectedAccount"
            class="is-primary"
            tag="nuxt-link"
            to="/Camera"
          >
            <strong>Launch App</strong>
          </b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      navItems: [{ to: '/gallery', label: 'Gallery' }],
    }
  },
  computed: {
    cBtnLabel() {
      return this.selectedAccount
        ? this.selectedAccountEnsName
          ? this.selectedAccountEnsName
          : this.selectedAccount
        : 'Connect'
    },
    ...mapState(['selectedAccount', 'selectedAccountEnsName']),
  },
}
</script>

<style scoped>
.item {
  color: #aed2ff;
}
</style>
