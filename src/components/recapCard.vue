<template>
  <div :class="`column ${size ? size : 'is-one-third'}`">
    <div class="card has-text-centered">
      <header class="card-header">
        <p class="card-header-title">{{ title }}</p>
      </header>
      <div class="card-content">
        <div class="columns" v-if="!loader">
          <div class="column" v-for="(item, index) in items" :key="index">
            {{ item.label }}
            <h3 class="title">
              <span v-if="valueType === 'currency'">
                {{ item.value | numeral('$0.0a') }} 
              </span>
              <span v-else-if="valueType === 'percentage'">
                {{ item.value | numeral('%0.00') }} 
              </span>
              <span v-else>
                {{ item.value }} 
              </span>
            </h3>
          </div>
        </div>
        <div v-else>
          <loadingIcon />
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import loadingIcon from '../components/loadingIcon'

export default {
  props: {
    size: String,
    title: String,
    items: Array,
    valueType: String,
    loader: Boolean
  },
  components: {
    loadingIcon
  }
}
</script>

<style scoped>
  .title {
    font-size: 1.8em;
  }
</style>