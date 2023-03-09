const axios = require('axios');
const {token} =require('./config.json');

solicitud()

async function solicitud(){

    
    const response = await axios.get('https://public-api.solscan.io/account/tokens?account=4KjxgEds5XEG1wuLZQYGqY87w9KuxpRjkBF65xn8rHQt',{
        headers: {
            'accept': 'application/json',
          'token': `${token}`
        }
      });
      const publicacionUltima = response;
      console.log(publicacionUltima);
}