const express = require('express');

const app = express();

app.get('/nukeldr', (req, res) => {
  res.send('Bot de nukeldr arriba!')
});

const axios = require('axios');
const { token_Solscan,
  channelAtlas,
  channelPolis,
  guild,
  token_bot,
  walletTBB,
  walletDAO } = require('./config.json');

const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, async c => {

  console.log(`¡Ready! Logged in as ${c.user.tag}`);

  const server = await client.guilds.fetch(guild);
  const Atlas = await server.channels.fetch(channelAtlas);
  const Polis = await server.channels.fetch(channelPolis);
  
  setInterval(async () => {

    let atlasTBB = await buscaATLAS(walletTBB, token_Solscan);
    let atlasDAO = await buscaATLAS(walletDAO, token_Solscan);
    let polisTBB = await buscaPOLIS(walletTBB, token_Solscan);
    let polisDAO = await buscaPOLIS(walletDAO, token_Solscan);

    if(!atlasTBB){
      atlasTBB = 0;
    } if (!atlasDAO){
      atlasDAO = 0;
    } if (!polisTBB){
      polisTBB = 0;
    } if (!polisDAO){
      polisDAO = 0;
    }

    let totalAtlas = await convertir(atlasDAO + atlasTBB);
    let totalPolis = await convertir(polisDAO + polisTBB);

    Atlas.setName(`👛 | Atlas: ${totalAtlas}`);
    Polis.setName(`👛 | Polis: ${totalPolis}`);

  }, 300000);
});

async function buscaATLAS(wallet, token_Solscan) {

  try {

    const response = await axios.get(wallet, {
      headers: {
        'accept': 'application/json',
        'token': `${token_Solscan}`
      }
    });

    let json = await JSON.parse(JSON.stringify(response.data));

    for (const i in json) {

      let token = await json[i].tokenAddress;

      if (token === 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx') {
        
        let montoAtlas = await json[i].tokenAmount.uiAmount;

        return montoAtlas;
      } 
    }

  } catch (ex) {
    response = null;
    console.log(ex);
  }
}

async function buscaPOLIS(wallet, token_Solscan) {

  try {

    const response = await axios.get(wallet, {
      headers: {
        'accept': 'application/json',
        'token': `${token_Solscan}`
      }
    });

    let json = await JSON.parse(JSON.stringify(response.data));

    for (const i in json) {

      let token = await json[i].tokenAddress;

      if (token === 'poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk') {

        let montoPolis = await json[i].tokenAmount.uiAmount;
        
        return montoPolis;
      }
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