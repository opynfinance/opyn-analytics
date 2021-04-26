<template>
  <div>

    <navbar />

    <div class="columns is-multiline mx-1 my-2">

      <recapCard 
        title="Volume" 
        valueType="currency"
        :loader="volumeLoader"
        :items="[
          {label: 'Total', value: `$${formatNumber(volumeStats['total_volume'])}` },
          {label: 'Last 7 days', value: `$${formatNumber(volumeStats['total_volume_last_7_days'])}` }
        ]"
      />

      <recapCard 
        title="Transactions" 
        :loader="volumeLoader"
        :items="[
          {label: 'total', value: `${formatNumber(volumeStats['transactions_size'])}` },
          {label: 'Last 7 Days', value: `${formatNumber(volumeStats['transactions_size_last_7_days'])}` }
        ]" 
      />

      <recapCard 
        title="Premium" 
        valueType="currency"
        :loader="volumeLoader"
        :items="[
          {label: 'total', value: `$${formatNumber(volumeStats['total_premium'])}` },
          {label: 'Last 7 days', value: `$${formatNumber(volumeStats['total_premium_last_7_days'])}` }
          ]"
      />

    </div>

    <div class="column is-full">
      <div class="card has-text-centered">
        <header class="card-header">
          <p class="card-header-title">Total Volume</p>
        </header>
        <div class="card-content" v-if="!chartVolumeLoader">
          <div class="buttons my-4 level-right ">
            <b-button  
              @click="getVolumesDataForChart('volume', 'by_day')"
              :class="volumeChartTimeFrame === 'by_day' ? '' : 'is-outlined'"
              type="is-primary"> 
              {{ 'Daily' }}
            </b-button>
            <b-button  
              @click="getVolumesDataForChart('volume', 'by_week')"
              :class="volumeChartTimeFrame === 'by_week' ? '' : 'is-outlined'"
              type="is-primary"> 
              {{ 'Weekly' }}
            </b-button>
            <b-button  
              @click="getVolumesDataForChart('volume', 'by_month')"
              :class="volumeChartTimeFrame === 'by_month' ? '' : 'is-outlined'"
              type="is-primary"> 
              {{ 'Monthly' }}
            </b-button>
          </div>

           <GChart
              type="ColumnChart"
              :data="volumesDataForChart"
              :options="chartOptions"
            />

        </div>
        <div class="card-content" v-else>
          <loadingIcon />
        </div> 
      </div>
    </div>

    <div class="column is-full">
      <div class="card has-text-centered">
        <header class="card-header">
          <p class="card-header-title">Daily Volume By Option (last 14 days)</p>
        </header>
        <div class="card-content" v-if="!chartVolumeByOptionLoader">

          <column-chart 
            :data="volumesByOptionDataForChart" 
            :stacked="true" 
            thousands="," 
            :round="0" 
            :legend="false">
          </column-chart>
        </div>
        <div class="card-content" v-else>
          <loadingIcon />
        </div> 
      </div>
    </div>

    <div class="column is-full">
      <div class="card has-text-centered">
        <header class="card-header">
          <p class="card-header-title">Total Premium</p>
        </header>
        <div class="card-content" v-if="!chartPremiumLoader">

          <div class="buttons my-4 level-right ">
            <b-button  
              @click="getVolumesDataForChart('premium', 'by_day')"
              :class="premiumChartTimeFrame === 'by_day' ? '' : 'is-outlined'"
              type="is-primary"> 
              {{ 'Daily' }}
            </b-button>
            <b-button  
              @click="getVolumesDataForChart('premium', 'by_week')"
              :class="premiumChartTimeFrame === 'by_week' ? '' : 'is-outlined'"
              type="is-primary"> 
              {{ 'Weekly' }}
            </b-button>
            <b-button  
              @click="getVolumesDataForChart('premium', 'by_month')"
              :class="premiumChartTimeFrame === 'by_month' ? '' : 'is-outlined'"
              type="is-primary"> 
              {{ 'Monthly' }}
            </b-button>
          </div>

           <GChart
              type="ColumnChart"
              :data="premiumDataForChart"
              :options="chartOptions"
            />

        </div>
        <div class="card-content" v-else>
          <loadingIcon />
        </div> 
      </div>
    </div>

    <deBankTvl />


    <optionsTable 
      title="Active Options"
      :options="activeOptions"  />
    
    <optionsTable 
      title="Expired Options"
      :options="expiredOptions" />

    <div class="columns is-multiline mx-1 my-4">
      <div class="column" v-for="(item, index) in volumesByExpiry" :key="index">
        <div class="card has-text-centered" >
          <header class="card-header">
            <p class="card-header-title">{{ item.label }} options</p>
          </header>
          <div class="card-content">
            <div class="columns">

              <div class="column">
                <p>total volume</p>
                <h3 class="title">
                  {{ item.data['totalVolume'].toFixed(0) | numeral('$0.0a') }}
                </h3>
              </div>
              <div class="column">
                <p>avg per option</p>
                <h3 class="title">
                  {{ item.data['avgPerOption'].toFixed(0) | numeral('$0.0a') }}
                </h3>             
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import recapCard from '../components/recapCard';
import deBankTvl from '../components/deBankTVL';
import loadingIcon from '../components/loadingIcon';
import optionsTable from '../components/optionsTable';
import navbar from '../components/navbar';

export default {
  components: {
    recapCard,
    deBankTvl,
    loadingIcon,
    optionsTable,
    navbar,
  },
  data() {
    return {
      volumeStats: {},
      volumeLoader: true,
      volumesDataForChart: [],
      chartOptions: {
        series: {
          0: {targetAxisIndex: 0},
          1: {targetAxisIndex: 0, type: "line"}
        },
        height: 450,
        bar: {
          groupWidth: '90%'
        },
        backgroundColor: '#1d2a38',
        colors: ['#4ec1a0', 'df691a'],
        hAxis: {
          textStyle: {
            color: '#8694a4'
          },
        },
        vAxis: {
          textStyle: {
            color: '#8694a4'
          },
          gridlines: {
            color: "#8694a4"
          },
        },
        legend: {
          position: 'top',
          textStyle: {
            color: '#8694a4'
          }
        }
      },
      volumeChartTimeFrame: 'by_day',
      chartVolumeLoader: true,
      volumesByOptionDataForChart: [],
      volumeByOptionChartTimeFrame: 'by_day',
      chartVolumeByOptionLoader: true,
      premiumDataForChart: [],
      premiumChartTimeFrame: 'by_day',
      chartPremiumLoader: true,
      options: [],
      allTransactions: [],
    }
  },
  computed: {
    activeOptions(){
      return this.options.filter(option => option.live)
    },
    expiredOptions(){
      return this.options.filter(option => !option.live)
    },
    oneWeekOptionsVolume(){
      let oTokens = this.options.filter( option => option.duration <= 8 )
      let totalVolume = this.returnTotalVolumesByOptions(oTokens)
      return { 
        totalVolume: totalVolume,
        avgPerOption: totalVolume / oTokens.length
      }
    },
    twoWeeksOptionsVolume(){
      let oTokens = this.options.filter( option => (option.duration <= 16 && option.duration > 8)  )
      let totalVolume = this.returnTotalVolumesByOptions(oTokens)
      return { 
        totalVolume: totalVolume,
        avgPerOption: totalVolume / oTokens.length
      }
    },
    oneMonthOptionsVolume(){
      let oTokens = this.options.filter( option => (option.duration <= 32 && option.duration > 16)  )
      let totalVolume = this.returnTotalVolumesByOptions(oTokens)
      return { 
        totalVolume: totalVolume,
        avgPerOption: totalVolume / oTokens.length
      }
    },
    twoMonthsOptionsVolume(){
      let oTokens = this.options.filter( option => (option.duration <= 62 && option.duration > 32)  )
      let totalVolume = this.returnTotalVolumesByOptions(oTokens)
      return { 
        totalVolume: totalVolume,
        avgPerOption: totalVolume / oTokens.length
      }
    },
    volumesByExpiry(){
      return [
        { label: '1 week', data: this.oneWeekOptionsVolume },
        { label: '2 weeks', data: this.twoWeeksOptionsVolume },
        { label: '1 month', data: this.oneMonthOptionsVolume },
        { label: '2 month', data: this.twoMonthsOptionsVolume }
      ]
    }
  },

  async mounted() {
    this.getVolumes()
    this.getVolumesDataForChart('volume', 'by_day')
    this.getVolumesByOptionDataForChart('volume', 'by_day')
    this.getVolumesDataForChart('premium', 'by_day')
    this.getOptions()
    this.getAllTransactions()
  },


  methods: {

    getVolumes(){
      const url = "https://opyn-kpi-api.herokuapp.com/api/v1/volumes"
      this.axios.get(url)
      .then( res => {
        this.volumeStats = res.data
        this.volumeLoader = false
      })
    },

    getVolumesDataForChart(chartType, sortType){
      let self = this

      const data_type = chartType ? chartType : 'volume'
      const sort = sortType ? sortType : 'by_day'

      const movingAvgRange = sort === 'by_day' ? 7.0 : sort === 'by_week' ? 4.0 : 0
      const movingAvgLabel =  sort === 'by_day' 
                              ? '7 days' 
                              : sort === 'by_week' 
                              ? '4 weeks' 
                              : 0
      
      if (chartType === 'volume') {
        self.volumeChartTimeFrame = sort
        self.chartVolumeLoader = true
      } else {
        self.premiumChartTimeFrame = sort
        self.chartPremiumLoader = true
      }

      const url = `https://opyn-kpi-api.herokuapp.com/api/v1/volumes/historical?data_type=${data_type}&sort=${sort}`
      this.axios.get(url)
      .then( res => {
        if (data_type === 'volume') {
          const volumesData = res.data.data        
          const volumeArray = Object.keys(volumesData).map((key) => 
            [key, volumesData[key]]
          )
          if (movingAvgRange > 0) {
            const movingAvg = self.returnMovingAverage(volumeArray, movingAvgRange)
            let array = [['Day', 'Volumes', `${movingAvgLabel} moving avg`]]
            for (const [key, volume] of Object.entries(volumesData)) {
              let mvgAvg =  movingAvg.filter(avg => avg[0] === key)[0] 
                            ? movingAvg.filter(avg => avg[0] === key)[0][1]
                            : null
              array.push([key, volume, mvgAvg])
            }
            self.volumesDataForChart = array

          } else {
            let array = [['Day', 'Volumes']]
            for (const [key, volume] of Object.entries(volumesData)) {
              array.push([key, volume])
            }
            self.volumesDataForChart = array
          }
          
          self.chartVolumeLoader = false
        } else {
          const premiumData = res.data.data
          const premiumArray = Object.keys(premiumData).map((key) => 
            [key, premiumData[key]]
          )
          if (movingAvgRange > 0) {
            const movingAvg = self.returnMovingAverage(premiumArray, movingAvgRange)
            let array = [['Day', 'Premium', `${movingAvgLabel} moving avg`]]
            for (const [key, premium] of Object.entries(premiumData)) {
              let mvgAvg =  movingAvg.filter(avg => avg[0] === key)[0] 
                            ? movingAvg.filter(avg => avg[0] === key)[0][1]
                            : null
              array.push([key, premium, mvgAvg])
            }
            self.premiumDataForChart = array
          } else {
            let array = [['Day', 'Premium']]
            for (const [key, premium] of Object.entries(premiumData)) {
              array.push([key, premium])
            }
            self.premiumDataForChart = array
          }
            
          self.chartPremiumLoader = false
        }
        
      })
    },

    getVolumesByOptionDataForChart(chartType, sortType){
      let self = this

      const data_type = chartType ? chartType : 'volume'
      const sort = sortType ? sortType : 'by_day'

     
      self.volumeByOptionChartTimeFrame = sort
      self.chartVolumeByOptionLoader = true
      

      const url = `https://opyn-kpi-api.herokuapp.com/api/v1/volumes/historical_by_otoken`
      this.axios.get(url)
      .then( res => {
        if (data_type === 'volume') {      

          self.volumesByOptionDataForChart = res.data   

          self.chartVolumeByOptionLoader = false
        } 
      })
    },

    formatNumber(value){
      if (value > 1e6) {
        return `${value / 1e6}m`
      } else {
        return `${value}`
      }
    },

    getOptions(){
      const url = "https://opyn-kpi-api.herokuapp.com/api/v1/otokens"
      this.axios.get(url)
      .then( res => {
        this.options = res.data
      }) 
    },

    getAllTransactions(){
      const url = "https://opyn-kpi-api.herokuapp.com/api/v1/transactions"
      this.axios.get(url)
      .then( res => {
        this.allTransactions = res.data
      }) 
    },

    returnTotalVolumesByOptions(oTokens){
      let totalVolumes = 0
      oTokens.map( oToken => {
        totalVolumes += Number(oToken.total_volumes)
      })
      return totalVolumes
    },

    returnMovingAverage(array, range){
      const totPeriods = range ? range : 7.0
      let movingAvg = []
      array.forEach((data, index) => {
        if ( index >= (totPeriods - 1) ) {

          let sum = 0
          
          for (var i = 1; i <= totPeriods; i++) {
            let position = index - (i-1)
            const value = array[ position ][1]
            sum = sum + value
          }

          const mean = sum / totPeriods;
          movingAvg.push([array[index][0], mean]);
        }
      })
      return movingAvg
    }

  }

}
</script>
