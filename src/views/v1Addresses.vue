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
        :loader="sellOTokensActionsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueSellerAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-fifth"
        title="Bought" 
        :loader="buyOTokensActionsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueBuyerAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-fifth"
        title="Mint and Sold" 
        :loader="mintLoader || sellOTokensActionsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${uniqueMintAndSoldAddresses.length}` }
        ]"
      />

      <recapCard 
        size="is-one-fifth"
        title="All Actions" 
        :loader="mintLoader || sellOTokensActionsLoader"
        :items="[
          {label: 'Unique Addresses', value: `${allUniqueAddresses.length}` }
        ]"
      />

     </div>


  </div>

</template>

<script>
import navbar from '../components/navbar'
import recapCard from '../components/recapCard'

export default {

  components: {
    navbar,
    recapCard,
  },

  data() {
    return {
      otokens: [],
      sellers: [],
      buyers: [],
      // transferEvents: [],
      sellOTokensActions: [],
      sellOTokensActionsLoader: true,
      buyOTokensActions: [],
      buyOTokensActionsLoader: true,
      mintEvents: [],
      mintLoader: true,
    }
  },

  computed: {
    uniqueMintShortActionsAddresses(){
      return [...new Set(this.mintEvents.map(mint => mint.minter))];
    },
    uniqueSellerAddresses(){
      return [...new Set(this.sellers)];
    },
    uniqueBuyerAddresses(){
      return [...new Set(this.buyers)];
    },
    uniqueMintAndSoldAddresses(){
      return this.uniqueSellerAddresses.filter( seller => 
        { return this.uniqueMintShortActionsAddresses.indexOf(seller) >= 0 }
      );
    },
    allUniqueAddresses(){
      const allAddresses = this.uniqueMintShortActionsAddresses.concat(
        this.uniqueSellerAddresses,
        this.uniqueBuyerAddresses
      );
      return [...new Set(allAddresses)];
    }
  },
  
  mounted(){
    this.getOtokensAndEvents()
  },

  methods: {
    getOtokensAndEvents(){

      const query = `
        {
          optionsContracts (first: 1000) {
            id
          }
        }`

      this.axios.post(
        process.env.VUE_APP_OPYN_SUBGRAPH_ENDPOINT_V1,
        JSON.stringify({ query })
      ).then((response) => {
        this.otokens = response.data.data.optionsContracts
        
        this.getTransferEvents()
        
        this.getMintEvents()
      })

    },

    async getTransferEvents() {
      this.getSellOtokensActions()
      this.getBuyOtokensActions()
    },

    async getSellOtokensActions() {
      await Promise.all(
        this.otokens.map ( async otoken => {

          const query = `
            {
              sellOTokensActions (first: 1000, orderBy: timestamp, orderDirection: asc, where: { token: "${otoken.id}" }) {
                token {
                  id
                }
                seller
                receiver
              }
            }`

          return this.axios.post(
            process.env.VUE_APP_OPYN_SUBGRAPH_ENDPOINT_V1,
            JSON.stringify({ query })
          ).then((response) => {

            let sellOTokensActions = response.data.data.sellOTokensActions

            sellOTokensActions.map( ev => {
              this.sellOTokensActions.push(ev)
              this.sellers.push(ev.receiver)
              return;
            })

          })

        })
      ).then( () => {
        this.sellOTokensActionsLoader = false
      })
    },

    async getBuyOtokensActions() {
      await Promise.all(
        this.otokens.map ( async otoken => {

          const query = `
            {
              buyOTokensActions (first: 1000, orderBy: timestamp, orderDirection: asc, where: { token: "${otoken.id}" }) {
                token {
                  id
                }
                buyer
              }
            }`

          return this.axios.post(
            process.env.VUE_APP_OPYN_SUBGRAPH_ENDPOINT_V1,
            JSON.stringify({ query })
          ).then((response) => {

            let buyOTokensActions = response.data.data.buyOTokensActions

            buyOTokensActions.map( ev => {
              this.buyOTokensActions.push(ev)
              this.buyers.push(ev.buyer)
              return;
            })

          })

        })
      ).then( () => {
        this.buyOTokensActionsLoader = false
      })
    },

    async getMintEvents() {

      await Promise.all(
        
        this.otokens.map ( async otoken => {

          const query = `
            {
              mintEvents (first: 1000, where: { token: "${otoken.id}" }) {
                token {
                  id
                }
                sender
                minter
                destination
                transaction
              }
            }`

          return this.axios.post(
            process.env.VUE_APP_OPYN_SUBGRAPH_ENDPOINT_V1,
            JSON.stringify({ query })
          ).then((response) => {

            let mintEvents = response.data.data.mintEvents

            mintEvents.map( ev => {
              this.mintEvents.push(ev)
              return;
            })
          
          })
        })

      ).then( () => {
        this.mintLoader = false
      })
    
    }

  }

}
</script>