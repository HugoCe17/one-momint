<template>
  <section class="section is-medium gradani">
    <h1 class="has-text-centered title">Sponsors</h1>

    <div class="columns">
      <div class="column">
        <carousel autoplay :scrollPerPage="false" :perPage="4">
          <slide v-for="logo in logos" :key="logo.name">
            <img class="slide" :src="logo.path" alt="" />
          </slide>
        </carousel>
      </div>
    </div>
  </section>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel'
export default {
  data() {
    return {
      logos: [
        {
          name: 'poap',
          path: 'https://avatars.githubusercontent.com/u/71664718?s=280&v=4',
        },
        {
          name: 'ens',
          path:
            'https://gblobscdn.gitbook.com/spaces%2F-LZWNj0_mU4_3ENJbw83%2Favatar.png?alt=media',
        },
        {
          name: 'dai',
          path:
            'https://d2aezjsmcp2rsz.cloudfront.net/companylogos/blob_cuKrpMf',
        },
        {
          name: 'ipfs',
          path:
            'https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png',
        },
      ],
    }
  },
  components: {
    Carousel,
    Slide,
  },
}
</script>
<style scoped>
img {
  max-height: 400px;
}
.gradani {
  border: 20px solid;
  margin: 1em;
  border-image-slice: 1;
  border-image-source: linear-gradient(270deg, #246655, #7957d5, #2550dd);
  -webkit-animation: animationname 30s ease infinite;
  -moz-animation: animationname 30s ease infinite;
  -o-animation: animationname 30s ease infinite;
  animation: animationname 30s ease infinite;
}
@-webkit-keyframes animationname {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes animationname {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-o-keyframes animationname {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes animationname {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
