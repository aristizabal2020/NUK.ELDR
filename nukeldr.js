const express = require('express');

const app = express();

app.get('/nukeldr', (req, res) => {
  res.send('Bot de nukeldr arriba!')
});

const axios = require('axios');
const { token_Solscan_aristi,
  token_Solscan_carmo,
  channelAtlas,
  channelPolis,
  guild,
  token_bot,
  walletTBB,
  walletDAO_ATLAS,
  walletDAO_POLIS } = require('./config.json');

const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent]
});

let AtlasTBB;
let PolisTBB;
let AtlasDAO;
let PolisDAO;

client.once(Events.ClientReady, async c => {

  console.log(`¡Ready! Logged in as ${c.user.tag}`);

  const server = await client.guilds.fetch(guild);
  const Atlas = await server.channels.fetch(channelAtlas);
  const Polis = await server.channels.fetch(channelPolis);

  setInterval( async () => {

  await buscaATLAS(walletTBB, token_Solscan_aristi);
  await buscaATLAS(walletDAO_ATLAS, token_Solscan_aristi);
  await buscaATLAS(walletDAO_POLIS, token_Solscan_carmo);

  let totalAtlas = convertir(AtlasTBB + AtlasDAO);
  let totalPolis = convertir(PolisTBB + PolisDAO);

  Atlas.setName(`👛 | Atlas: ${totalAtlas}`);
  Polis.setName(`👛 | Polis: ${totalPolis}`);

  console.log(totalAtlas +" "+totalPolis);

  }, 7500000);
});

async function buscaATLAS(wallet, token_Solscan) {

  try {

    const response = await axios.get(wallet, {
      headers: {
        'accept': 'application/json',
        'token': `${token_Solscan}`
      }
    });

    if (response.status === 200) {
      console.log('La respuesta es 200');
      let json = await JSON.parse(JSON.stringify(response.data));

      for (const i in json) {

        let token = await json[i].tokenAddress;

        if (token === 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx') {

          let montoAtlas = await json[i].tokenAmount.uiAmount;

          if (wallet == walletTBB) {

            AtlasTBB = montoAtlas;

          } else if (wallet == walletDAO_ATLAS) {

            AtlasDAO = montoAtlas;

          }

        }
        if (token === 'poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk') {

          let montoPolis = await json[i].tokenAmount.uiAmount;

          if (wallet == walletTBB) {

            PolisTBB = montoPolis;
            
          } else if (wallet == walletDAO_POLIS) {

            PolisDAO = montoPolis;
          }

        }
      }
    } else {
      console.log("El servidor tardó: "+ response.status);
    }


  } catch (ex) {
    response = null;
    console.log(ex);
  }
}

function convertir(num) {
  let resul = num.toFixed(3);
  let convertido = Intl.NumberFormat().format(resul);
  return convertido;
}

client.login(token_bot);

app.listen(4500, () => {
  console.log('iniciado');
});