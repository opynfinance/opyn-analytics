<template>
  <div>
    
    <logo />

    <h1 class="subtitle has-text-centered">Opyn v2 Gamma Protocol Analytics</h1>

    <div class="has-text-centered ">
      <div class="columns">
        <div class="column">
          <router-link to="/">Volumes</router-link>
        </div>
        <div class="column">
          <router-link to="/addresses">Addresses</router-link>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import logo from '../components/logo'


export default {
  components: {
    logo
  },
}
</script>