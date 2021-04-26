const moment = require('moment');
const axios = require('axios');


exports.getPriceCoingecko = (address, timestamp) => {
    // formattedDate = convertDate(date)
    let formattedDate = moment.utc(timestamp * 1000 ).format("DD-MM-YYYY");

    let price = 0

    axios.get(
      `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
    ).then( res => {
      let token = res.data.id
      axios.get(
        `https://api.coingecko.com/api/v3/coins/${token}/history?date=${formattedDate}&localization=false`,
      )
      .then( response => {
        price = response.data['market_data']["current_price"]["usd"]
      })
    })

    return price

}