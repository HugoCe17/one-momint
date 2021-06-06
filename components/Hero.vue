<template>
  <section class="hero main">
    <div class="container">
      <div class="hero-body">
        <div class="columns holder">
          <div class="column is-three-quarters">
            <p class="title is-size-1 has-text-weight-bold">
              MoMint: fully decentralized Snap Minting&trade;
            </p>
            <p class="subtitle is-italic has-text-weight-light">
              Life is short, mint it.
            </p>
            <h1 class="is-size-2 mt-6">
              <div ref="typeEffect"></div>
            </h1>
            <br />
          </div>
          <div class="column">
            <b-image responsive :src="require('~/assets/crypto.png')" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    const delay = 130
    new this.$typeit(this.$refs.typeEffect, {
      speed: 90,
      startDelay: 1000,
      lifeLike: true,
      loop: true,
      loopDelay: 3000,
    })
      .type('Instantly capture the beauty.')
      .delete(-7, { speed: 150, delay: 180 })
      .type(' excitement.')
      .delete(-12, { speed: 150, delay: 180 })
      .type(' moment.')
      .break({ delay })
      .type('Into an NFT', { delay })
      .go()
  },
}
</script>
