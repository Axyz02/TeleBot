const { Telegraf, Markup, Extra } = require("telegraf");
const axios = require("axios");

//Api key
const bot = new Telegraf("5901908240:AAGNVy0wUXRO8ugW25B9qraRWY5ZxN4V_HM");

let values = [(compra = null), (venta = null), (avg = null)];

const setValues = (json) => {
  values[0] = json.value_buy;
  values[1] = json.value_sell;
  values[2] = json.value_avg;
};

const getCotizacion = async () => {
  axios
    .get("https://api.bluelytics.com.ar/v2/latest")
    .then(function (response) {
      values[0] = response.data.blue.value_buy;
      values[1] = response.data.blue.value_sell;
      values[2] = response.data.blue.value_avg;
      return values;
    });
};

//? Default commands

bot.start(async (ctx) => {
  getCotizacion();
  const nombre = ctx.message.from.first_name;
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Hola ${nombre}, bienvenido!
Abajo vas a encontrar mis funciones.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Compra", callback_data: "compra" },
            { text: "Promedio", callback_data: "promedio" },
            { text: "Venta", callback_data: "venta" },
          ],
        ],
      },
      reply_markup: {
        keyboard: [
          [{ text: "/compra" }, { text: "/promedio" }, { text: "/venta" }],
        ],
        resize_keyboard: true,
      },
    }
  );
});

bot.help((ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Hola, soy el Dolar bot!
Mi proposito es darte la cotizacion del dolar en el momento.
Abajo vas a encontrar mis funciones.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Compra", callback_data: "compra" },
            { text: "Promedio", callback_data: "promedio" },
            { text: "Venta", callback_data: "venta" },
          ],
        ],
      },
    }
  );
});

//? Custom commands

bot.command("p", async (ctx) => {
  try{
  await getCotizacion().then(
  ctx.reply("asd\n" + values[0]));
  } catch (error) {
    console.log(error);
  }
    /*ctx.reply(`Hola!
        La cotiazcion promedio es 💵 ${avg}`)*/
});

bot.command("venta",async (ctx) => {
  await getCotizacion().then(
  ctx.reply(`Hola!
La cotiazcion de venta es 💵 ${values[0]}`));
});
bot.command("compra", (ctx) => {
  ctx.reply(`Hola!
La cotiazcion de compra es 💵 ${compra}`);
});

//? Bot actions

bot.action("compra", (ctx) => {
  ctx.reply(`Hola!
    La cotiazcion de compra es 💵 ${compra}`);
});
bot.action("promedio", (ctx) => {
  ctx.reply(`Hola!
    La cotiazcion promedio es 💵 ${avg}`);
});
bot.action("venta", (ctx) => {
  ctx.reply(`Hola!
    La cotiazcion de venta es 💵 ${venta}`);
});


bot.launch();
