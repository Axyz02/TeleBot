const { Telegraf, Markup, Extra } = require('telegraf');
const axios = require('axios');

//Api key
const bot = new Telegraf('5733932031:AAHYDbIEoSVAbHsoCQjzzNRZYAbsUQxfSF8');


let compra = undefined;
let venta = undefined;
let avg = undefined


const setValues = (json) => {
    compra = json.value_buy;
    venta = json.value_sell;
    avg = json.value_avg;
}

const getCotizacion = () => {
    axios.get('https://api.bluelytics.com.ar/v2/latest')
        .then(function (response) {
            setValues(response.data.blue);
        })
}


bot.start(async ctx => {
    const nombre = ctx.message.from.first_name;
    ctx.reply(`Hola ${nombre}, bienvenido!`);
});




bot.help((ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, `Hola, soy el Dolar bot!
Mi proposito es darte la cotizacion del dolar en el momento.
Abajo vas a encontrar mis funciones.`, {
        reply_markup: {
            keyboard: [
                [
                { input_field_placeholder: "Compra",
                    text: "/Compra" },
                { text: "/Promedio" },
                { text: "/Venta" }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
}
);

bot.command('Promedio', (ctx) => {
    ctx.reply(`Hola!
El valor promedio es 💵 ${avg}`);
})
bot.command('Venta', (ctx) => {
    ctx.reply(`Hola!
El valor de venta es 💵 ${venta}`);
})
bot.command('Compra', (ctx) => {
    ctx.reply(`Hola!
El valor de compra es 💵 ${compra}`);
})

getCotizacion();
bot.launch();
