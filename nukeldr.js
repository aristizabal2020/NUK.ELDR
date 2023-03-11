const express = require('express');

const app = express();

app.get('/nukeldr', (req, res) => {
  res.send('Bot de nukeldr arriba!')
});

const axios = require('axios');
const { token_Solscan, channelAtlas, channelPolis, guild, token_bot } = require('./config.json');

const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  async function actualizaWallet() {

    const server = await client.guilds.fetch(guild);
    const Atlas = await server.channels.fetch(channelAtlas);
    const Polis = await server.channels.fetch(channelPolis);

    try {

      const response = await axios.get('https://public-api.solscan.io/account/tokens?account=4KjxgEds5XEG1wuLZQYGqY87w9KuxpRjkBF65xn8rHQt', {
        headers: {
          'accept': 'application/json',
          'token': `${token_Solscan}`
        }
      });

      let json = await JSON.parse(JSON.stringify(response.data));
      // console.log(json);

      for (const i in json) {

        let token = await json[i].tokenAddress;

        if (token === 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx') {
          //Declaraciones ejecutadas cuando el resultado de expresiÃ³n coincide con el valor1
          let montoAtlas = await json[i].tokenAmount.uiAmount;
          let montoAtlas2 = convertir(montoAtlas);

          await Atlas.setName(`👛 | Atlas: ${montoAtlas2}`);

        } else if (token === 'poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk') {

          //Declaraciones ejecutadas cuando el resultado de expresiÃ³n coincide con el valor2
          let montoPolis = await json[i].tokenAmount.uiAmount;
          let montoPolis2 = convertir(montoPolis);
          Polis.setName(`👛 | Polis: ${montoPolis2}`);

        }
      }

    } catch (ex) {
      response = null;
      console.log(ex);
    }
  }

  setInterval(actualizaWallet, 300000);

});

function convertir(num) {
  let resul = num.toFixed(3);
  let convertido = Intl.NumberFormat().format(resul);
  return convertido;
}

// Log in to Discord with your client's token
client.login(token_bot);

app.listen(4500, () => {
  console.log('iniciado');
  });