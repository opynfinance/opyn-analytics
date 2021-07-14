<template>
  <div>

    <navbar />

    <div class="columns is-multiline mx-1 my-2">

      <recapCard 
        size="is-one-fifth"
        title="Mint" 
        :loader="mintLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueMintShortActionsAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-fifth"
        title="Sold" 
        :loader="otokenTradesLoader || swapsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueSellerAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-fifth"
        title="Bought" 
        :loader="otokenTradesLoader || swapsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueBuyerAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-fifth"
        title="Mint and Sold" 
        :loader="otokenTradesLoader || swapsLoader || mintLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueMintAndSoldAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-fifth"
        title="All Actions" 
        :loader="otokenTradesLoader || swapsLoader || mintLoader"
        :items="[
          {label: 'Unique Addresses', value: `${allUniqueAddresses.length}` }
        ]"
      />

    </div>

    <fullChart 
      title="Mint Weekly Unique Addresses (UTC time - week starts on Monday)"
      :loader="mintLoader"
      :chartData="uniqueMintShortActionsAddressesByWeek"
    />

    <fullChart 
      title="Sell Weekly Unique Addresses (UTC time - week starts on Monday)"
      :loader="otokenTradesLoader || swapsLoader"
      :chartData="uniqueSellerAddressesByWeek"
    />

    <fullChart 
      title="Buy Weekly Unique Addresses (UTC time - week starts on Monday)"
      :loader="otokenTradesLoader || swapsLoader"
      :chartData="uniqueBuyerAddressesByWeek"
    />

  </div>
</template>

<script>
import _ from 'lodash';

import navbar from '../components/navbar'
import recapCard from '../components/recapCard'
import fullChart from '../components/fullChart'


export default {
  components: {
    navbar,
    recapCard,
    fullChart
  },

  data() {
    return {
      oTokens: [],
      otokenTrades: [],
      otokenTradesLoader: true,
      swaps: [],
      swapsLoader: true,
      sellers: [],
      buyers: [],
      mintLoader: true,
      mintShortActions: []
    }
  },

  computed: {
    uniqueMintShortActionsAddresses(){
      return [...new Set(this.mintShortActions.map(mint => mint.to))];
    },
    uniqueSellerAddresses(){
      return [...new Set(this.sellers)];
    },
    uniqueBuyerAddresses(){
      return [...new Set(this.buyers)];
    },
    uniqueMintAndSoldAddresses(){
      return this.uniqueSellerAddresses.filter( seller => 
        { return this.uniqueMintShortActionsAddresses.indexOf(seller) >= 0; }
      );
    },
    allUniqueAddresses(){
      const allAddresses = this.uniqueMintShortActionsAddresses.concat(
        this.uniqueSellerAddresses,
        this.uniqueBuyerAddresses
      );
      return [...new Set(allAddresses)];
    },
    allTrades(){
      let trades = [];

      this.otokenTrades.map( trade => {
        trades.push({ 
          timestamp: trade.timestamp, 
          seller: trade.seller, 
          buyer: trade.buyer
        })
      });

      this.swaps.map( swap => {
        trades.push({ 
          timestamp: swap.timestamp, 
          seller: swap.seller, 
          buyer: swap.buyer
        })    
      });

      return trades

    },
    uniqueMintShortActionsAddressesByWeek(){
      return this.addressesByWeek(this.mintShortActions, 'to').map ( 
        item => Object.values({ date: item.date, value: new Set(item.addresses).size }) 
      )
    },
    uniqueSellerAddressesByWeek(){
      return this.addressesByWeek(this.allTrades, 'seller').map ( 
        item => Object.values({ date: item.date, value: new Set(item.addresses).size }) 
      )
    },
    uniqueBuyerAddressesByWeek(){
      return this.addressesByWeek(this.allTrades, 'buyer').map ( 
        item => Object.values({ date: item.date, value: new Set(item.addresses).size }) 
      )
    },
   
  },

  async mounted() {
    this.getOTokensAndTransactions()
    this.getMintAddresses()
  },

  methods: {

    getOTokensAndTransactions(){
      const query = `
      {
        otokens(first: 1000, orderBy: expiryTimestamp, orderDirection: asc) {
          id
          symbol
          name
          isPut
          expiryTimestamp
          totalSupply
          strikePrice
          createdAt
          underlyingAsset {
            symbol
            id
            decimals
          }
        }
      }`;

      this.axios.post(
        process.env.VUE_APP_OPYN_SUBGRAPH_ENDPOINT,
        JSON.stringify({ query })
      ).then((response) => {
        this.oTokens = response.data.data.otokens

        this.getTransactions()

      })
    },

    async getTransactions(){

      await Promise.all(
        this.oTokens.map ( async otoken => {
          const otokenAddress = otoken.id
          return this.get0xTransaction(otokenAddress)
        })
      ).then( () => {
        this.otokenTradesLoader = false
      })

      await Promise.all(
        this.oTokens.map ( async otoken => {
          const otokenAddress = otoken.id
          return this.getAirswapTransaction(otokenAddress)
        })
      ).then( () => {
        this.swapsLoader = false
      })

    },

    async get0xTransaction(otokenAddress){
      const query = `
        {
          otokenTrades(first: 1000, orderBy: timestamp, orderDirection: asc, where: { oToken: "${otokenAddress}" }){
            id
            timestamp
            buyer
            seller
            oToken {
              id
            }
            paymentToken {
              id
            }
            oTokenAmount
            paymentTokenAmount
            transactionHash
          }    
        }`;

      return this.axios.post(
        process.env.VUE_APP_OPYN_SUBGRAPH_ENDPOINT,
        JSON.stringify({ query })
      ).then((response) => {
        response.data.data.otokenTrades.map ( trade => {
          this.otokenTrades.push(trade)
          this.sellers.push(trade.seller)
          this.buyers.push(trade.buyer)
        })
        return;
      })
      
    },

    getAirswapTransaction(otokenAddress){
      const query = `
        {
          swaps(first: 1000, orderBy: timestamp, orderDirection: asc, where: { affiliateToken_contains: "${otokenAddress}" }){
            id
            from
            to
            senderAmount
            senderToken {
              id
            }
            sender {
              id
            }
            signerToken {
              id
            }
            signerAmount
            signer {
              id
            }
            timestamp
            transactionHash
          }    
        }`;

      return this.axios.post(
        process.env.VUE_APP_AIRSWAP_SUBGRAPH_ENDPOINT,
        JSON.stringify({ query })
      ).then((response) => {
        response.data.data.swaps.map ( trade => {
          
          const seller = trade.sender.id === otokenAddress ? trade.sender.id : trade.signer.id
          const buyer = trade.sender.id === otokenAddress ? trade.signer.id : trade.sender.id

          this.sellers.push(seller)
          this.buyers.push(buyer)

          this.swaps.push({
            timestamp: trade.timestamp,
            seller: seller,
            buyer: buyer
          })

        })
        return;
      })
    },

    getMintAddresses(){

      const query = `
        {
          mintShortActions(first: 1000, orderBy: timestamp, orderDirection: asc ){
            id
            timestamp
            to
            oToken {
              id
            }
          }    
        }`;

      this.axios.post(
        process.env.VUE_APP_OPYN_SUBGRAPH_ENDPOINT,
        JSON.stringify({ query })
      ).then((response) => {
        this.mintShortActions = response.data.data.mintShortActions;
        this.mintLoader = false
      })
    },

    addressesByWeek(array, addressName){
      let arrayByWeek = _(array.sort((a, b) => a.timestamp.localeCompare(b.timestamp)))
      .groupBy( item => this.$moment.utc( this.$moment.unix(item['timestamp']) , 'MM-DD-YY').startOf('isoWeek') )
      .map((objs, key) => ({
        'date': this.$moment.utc(key).format('MM-DD-YY'),
          'addresses': objs.map ( obj => {
            return obj[addressName]
          })
        }))
      .value()

      return arrayByWeek
    },

  }

}
</script>