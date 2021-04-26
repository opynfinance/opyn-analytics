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

        </div>
      </div>
    </nav>

     <Logo />

    <h1 class="subtitle has-text-centered">Opyn v2 Gamma Protocol Analytics</h1>

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