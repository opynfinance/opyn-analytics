<template>
  
    <div class="column is-full">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{{ title }}</p>
        </header>
        <div class="card-content">
          <div class="content">

            <b-table
              v-if="options"
              :data="options.sort(
                (a,b) => (a.total_volumes < b.total_volumes) 
                ? 1 
                : ((b.total_volumes < a.total_volumes) ? -1 : 0)
              )"
              >
              <b-table-column field="symbol" label="symbol" v-slot="props">
                {{ props.row.symbol }}
              </b-table-column>
              <b-table-column field="address" label="address" v-slot="props">
                <a :href="`https://etherscan.io/address/${props.row.address}`">{{ props.row.address }}</a>
              </b-table-column>
              <b-table-column field="duration" label="days" v-slot="props" >
                {{ props.row.duration }}
              </b-table-column>
              <b-table-column field="expired" label="live" v-slot="props">
                {{ props.row.live ? '🟢' : '🔴' }}
              </b-table-column>
              <b-table-column field="totalSupply" label="supply" v-slot="props" numeric>
                {{ props.row.total_supply ? props.row.total_supply : '-'}}
              </b-table-column>
              <b-table-column field="premium traded" label="premium traded ($k)" v-slot="props" numeric>
                {{ (props.row.total_premium / 1e3).toFixed(2) }}
              </b-table-column>            
              <b-table-column field="volume" label="avg daily vol ($k)" v-slot="props" numeric>
                {{ (props.row.volumes_per_day / 1e3).toFixed(2) }}
              </b-table-column>
              <b-table-column field="volume" label="volume ($k)" v-slot="props" numeric>
                {{ (props.row.total_volumes / 1e3).toFixed(2) }}
              </b-table-column>
            </b-table>

          </div>
        </div>
 
      </div>
    </div>
</template>

<script>
  export default {
    props: {
      title: String,
      options: Array,
    }
  }
</script>
