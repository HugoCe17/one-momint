<template>
  <div>
    <video
      v-show="!snapCaptured"
      id="webcam"
      ref="webcam"
      autoplay
      playsinline
    ></video>
    <canvas v-show="snapCaptured" id="canvas" ref="canvas"></canvas>
    <div class="buttons">
      <NuxtLink to="/">
        <b-icon icon="backspace" type="is-white" size="is-medium"> </b-icon>
      </NuxtLink>

      <b-icon
        icon="camera"
        type="is-white"
        size="is-large"
        @click.native="snap"
      >
      </b-icon>
      <b-icon
        icon="camera-flip"
        type="is-white"
        size="is-medium"
        @click.native="flip"
      >
      </b-icon>
    </div>
    <b-modal
      ref="modal"
      v-model="isModal"
      :on-cancel="modalClosedEvent"
      :can-cancel="['x']"
      class="modal"
    >
      <h1
        class="
          title
          is-size-1
          has-text-centered has-text-weight-bold has-text-white
        "
      >
        {{ modalText }}
      </h1>

      <lottie-player
        v-show="step == 1"
        src="https://assets5.lottiefiles.com/packages/lf20_llkmhppf.json"
        background="transparent"
        speed="1"
        class="lottie-player"
        style="width: 300px; height: 300px"
        loop
        autoplay
      ></lottie-player>
      <lottie-player
        v-show="step == 2"
        src="https://assets3.lottiefiles.com/temp/lf20_iRxzMr.json"
        background="transparent"
        speed="1"
        class="lottie-player"
        style="width: 300px; height: 300px"
        loop
        autoplay
      ></lottie-player>
      <lottie-player
        v-show="step == 3"
        src="https://assets4.lottiefiles.com/private_files/lf30_ln2embei.json"
        background="transparent"
        speed="1"
        class="lottie-player"
        style="width: 300px; height: 300px"
        loop
        autoplay
      ></lottie-player>
      <div v-show="step == 3" class="txLinks">
        <a :href="openSeaLink">
          <img
            class="txIcon"
            src="https://opensea.io/static/images/logos/opensea-logo.png"
            alt=""
        /></a>

        <a :href="etherscanLink">
          <img
            class="txIcon"
            src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png"
            alt=""
          />
        </a>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LottiePlayer from '@lottiefiles/lottie-player'

import momintABI from '~/contracts/ABI/ERC721.json'
import { MOMINT_CONTRACT_ADDRESS } from '~/constants'

export default {
  components: { LottiePlayer },
  middleware({ redirect, $web3 }) {
    if (!$web3.currentProvider.wc.connected) {
      redirect('/')
    }
  },
  data() {
    return {
      camera: null,
      modalText: 'Sending your image on a Interplanetary Mission',
      picture: '',
      openSeaLink: '',
      etherscanLink: '',
      step: 1,
      isLoading: true,
      snapCaptured: false,
      isModal: false,
    }
  },

  mounted() {
    const webcamElement = this.$refs.webcam
    const canvasElement = this.$refs.canvas
    this.camera = new this.$webcam(webcamElement, 'user', canvasElement)
    this.momint = new this.$web3.eth.Contract(
      momintABI,
      MOMINT_CONTRACT_ADDRESS
    )

    this.camera
      .start()
      .then(() => {
        console.log('webcam started')
      })
      .catch((err) => {
        console.error(err)
      })

    console.log(this.momint)

    this.isLoading = false
  },

  destroyed() {
    if (this.camera) {
      this.camera.stop()
    }
  },

  methods: {
    snap() {
      this.picture = this.camera.snap()
      this.snapCaptured = true
      this.isModal = true

      fetch(this.picture)
        .then((res) => res.blob())
        .then(async (blob) => {
          const file = new this.$nftStorageFile([blob], 'nftdata.png', {
            type: 'image/png',
          })
          await this.sendToNftStorage(file)
        })
    },

    flip() {
      this.camera.flip()
      this.camera.start()
    },

    async sendToNftStorage(image) {
      const today = new Date()
      const metadata = await this.$nftStorageClient.store({
        name: today.toLocaleDateString('en-US'), // 9/17/2016
        description: String(today),
        image,
      })

      this.$store.commit('pushToNFTCollection', {
        name: metadata.data.name,
        description: metadata.data.description,
        image: metadata.data.image,
      })

      await this.mint(metadata)
    },

    async mint(metadata) {
      const mint = await this.momint.methods
        .mint(metadata.url)
        .send(
          { from: await this.$web3.currentProvider.accounts[0] },
          async (error, result) => {
            if (!error) {
              this.modalText = 'Minting your MoMint...'
              await this.$nextTick()
              this.step = 2
            } else {
              this.snapCaptured = false
            }
          }
        )
        .then(async (result) => {
          console.log(result)
          this.modalText = 'Success!'
          this.openSeaLink =
            'https://testnets.opensea.io/assets/0xD9546d7b514a33EFF8785f97bF0B047326AA7d3d/' +
            result.events.Transfer.returnValues.tokenId
          this.etherscanLink =
            'https://rinkeby.etherscan.io/tx/' + result.transactionHash
          await this.$nextTick()

          this.step = 3
        })
        .catch((error) => {
          console.log(error)
          this.$refs.modal.close()
        })
      console.log(mint)
    },

    modalClosedEvent() {
      console.log('modal closed')
      this.modalText = 'Sending your image on an Interplanetary Mission'
      this.step = 1
      this.camera.start()
      this.snapCaptured = false
    },
  },
}
</script>

<style scoped>
video {
  width: 100vw;
  min-height: 100vh;
  margin: auto;
  position: absolute;
  object-fit: cover;
  background: black;
  -webkit-transform: scaleX(-1) rotateY(180deg);
  -moz-transform: scaleX(-1) rotateY(180deg);
  -o-transform: scaleX(-1) rotateY(180deg);
  transform: scaleX(-1) rotateY(180deg);
}

canvas {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  object-fit: cover;
  margin: auto;
  filter: blur(5px);
}

.buttons {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: fixed;
  bottom: 0;
  background-color: transparent;
  width: 100vw;
  height: 10vh;
}
.lottie-player {
  margin: 0 auto;
}
.txLinks {
  display: flex;
  justify-content: center;
}

.txIcon {
  height: 75px;
  margin: 10px;
}
</style>
