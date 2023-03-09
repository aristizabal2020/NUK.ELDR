const axios = require('axios');

solicitud()

async function solicitud(){

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2NzgzMjc0NTA2NzAsImVtYWlsIjoiYXJpc3RpemFiYWwub2NhbXBvQGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImlhdCI6MTY3ODMyNzQ1MH0.lS4bSC2mV8RombbWc_tFu8mAhbsCW-LpqEIPn1snspM';
    const response = await axios.get('https://public-api.solscan.io/account/tokens?account=4KjxgEds5XEG1wuLZQYGqY87w9KuxpRjkBF65xn8rHQt',{
        headers: {
            'accept': 'application/json',
          'token': `${token}`
        }
      });
      const publicacionUltima = response;
      console.log(publicacionUltima);
}