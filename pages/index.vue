<template>
  <section>
    <vue-particles
      color="#aed2ff"
      :particle-opacity="0.5"
      :particles-number="120"
      shape-type="polygon"
      :particle-size="2"
      lines-color="#aed2ff"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
    >
    </vue-particles>
    <hero />
    <sponsors />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import Sponsors from '~/components/Sponsors.vue'
import Hero from '~/components/Hero.vue'

export default {
  name: 'HomePage',

  computed: {
    ...mapState(['selectedAccount', 'chainId']),
  },
  components: {
    Sponsors,
    Hero,
  },
}
</script>

<style>
canvas {
  position: absolute;
}
</style>
