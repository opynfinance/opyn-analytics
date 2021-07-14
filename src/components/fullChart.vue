<template>
  <div class="column is-full">
    <div class="card has-text-centered">
      <header class="card-header">
        <p class="card-header-title">{{ title }}</p>
      </header>
      <div class="card-content" v-if="!loader">

        <column-chart 
          :data="chartData" 
          :colors="['#4ec1a0']"
          :legend="false">
        </column-chart>
      </div>
      <div class="card-content" v-else>
        <loadingIcon />
      </div> 
    </div>
  </div>
</template>

<script>
import loadingIcon from '../components/loadingIcon'

export default {

  components: {
    loadingIcon
  },

  props: {
    title: String,
    loader: Boolean,
    chartData: Array
  }
}
</script>