<template>
    <div class="column is-full">
      <div class="card has-text-centered">
        <header class="card-header">
          <p class="card-header-title">Total Value Locked (DeBank data)</p>
        </header>
        <div class="card-content">
          <column-chart :data="returnDataForChart" thousands="," :round="0" :colors="['#4ec1a0']"></column-chart>
        </div>
      </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  
  data() {
    return {
      tvl: []
    }
  },

  mounted() {
    this.getDataFromDeBank()
  },

  computed: {
    returnDataForChart(){
      return this.tvl.map ( item => {
        return Object.values({ date: moment(item.date_at).format('MM-DD-YY'), value: item.locked_usd_value})
      })
    }
  },

  methods: {
    getDataFromDeBank(){
      let self = this
      this.axios.get('https://api.debank.com/project/tvl_chart?id=opyn2', )
      .then(res => {
        self.tvl = res.data.data
      })
    }
  }

}
</script>