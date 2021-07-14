<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-menu">
        <div class="navbar-end">
          <router-link 
            :class="`navbar-item ${this.$route.name === 'Volumes' ? 'is-active' : ''}`" 
            to="/" >
            Volumes
          </router-link>
  
          <router-link 
            :class="`navbar-item ${this.$route.name === 'Addresses' ? 'is-active' : ''}`" 
            to="/addresses">
            Addresses
          </router-link>

          <router-link 
            :class="`navbar-item ${this.$route.name === 'v1Addresses' ? 'is-active' : ''}`" 
            to="/v1-addresses">
            v1 Addresses
          </router-link>
        </div>
      </div>
    </nav>

    <Logo />
    <h1 class="subtitle has-text-centered mb-4">
      Opyn 
      {{ this.$route.name.includes('v1') ? 'v1 Convexity Protocol' : 'v2 Gamma Protocol' }}
      Analytics
    </h1>

  </div>
</template>

<script>
import Logo from './Logo'


export default {
  components: {
    Logo
  },
}
</script>