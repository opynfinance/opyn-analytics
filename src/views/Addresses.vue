<template>
  <div>

    <Navbar />

    <div class="columns is-multiline mx-1 my-2">

      <recapCard 
        size="is-one-quarter"
        title="Mint" 
        :loader="mintLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueMintShortActionsAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-quarter"
        title="Sold" 
        :loader="otokenTradesLoader || swapsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueSellerAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-quarter"
        title="Bought" 
        :loader="otokenTradesLoader || swapsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueBuyerAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-quarter"
        title="Mint and Sold" 
        :loader="otokenTradesLoader || swapsLoader || mintLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueMintAndSoldAddresses.length}` }
        ]"
      />

    </div>

  </div>
</template>

<script>

import Navbar from '../components/Navbar'
import recapCard from '../components/recapCard'


export default {
  components: {
    Navbar,
    recapCard
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
        { return this.uniqueMintShortActionsAddresses.indexOf(seller) > 0; }
      );
    }
  },

  async mounted() {
    this.getOTokensAndTransactions()
    this.getMintAddresses()
  },

  methods: {

    getOTokensAndTransactions(){
      const query = `
      {
        otokens(orderBy: expiryTimestamp, orderDirection: desc) {
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
          otokenTrades(first: 1000, orderBy: timestamp, orderDirection: desc, where: { oToken: "${otokenAddress}" }){
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
          swaps(first: 1000, orderBy: timestamp, orderDirection: desc, where: { affiliateToken_contains: "${otokenAddress}" }){
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
          this.swaps.push(trade)
          // seller
          if (trade.sender.id === otokenAddress) {
            this.sellers.push(trade.sender.id)
            this.buyers.push(trade.signer.id)
          } else {
            this.sellers.push(trade.signer.id)
            this.buyers.push(trade.sender.id)
          }
        })
        return;
      })
    },

    getMintAddresses(){

      const query = `
        {
          mintShortActions(first: 1000){
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
    }

  }

}
</script>