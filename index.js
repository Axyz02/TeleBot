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

//? Defautl commands

bot.start(async ctx => {
    const nombre = ctx.message.from.first_name;
    bot.telegram.sendMessage(ctx.chat.id, `Hola ${nombre}, bienvenido!
Abajo vas a encontrar mis funciones.`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Compra', callback_data: 'compra' },
                    { text: 'Promedio', callback_data: 'promedio' },
                    { text: 'Venta', callback_data: 'venta' },
                ]
            ]
        },
            reply_markup: {
                keyboard: [
                    [
                    { text: "/compra" },
                    { text: "/promedio" },
                    { text: "/venta" }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
    })
}
);

bot.help((ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, `Hola, soy el Dolar bot!
Mi proposito es darte la cotizacion del dolar en el momento.
Abajo vas a encontrar mis funciones.`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Compra', callback_data: 'compra' },
                        { text: 'Promedio', callback_data: 'promedio' },
                        { text: 'Venta', callback_data: 'venta' },
                    ]
                ]
            }
        })
}
);

//? Custom commands

bot.command('promedio', (ctx) => {
    ctx.reply(`Hola!
La cotiazcion promedio es 💵 ${avg}`);
})
bot.command('venta', (ctx) => {
    ctx.reply(`Hola!
La cotiazcion de venta es 💵 ${venta}`);
})
bot.command('compra', (ctx) => {
    ctx.reply(`Hola!
La cotiazcion de compra es 💵 ${compra}`);
})


//? Bot actions

bot.action("compra", ctx => {
    ctx.reply(`Hola!
    La cotiazcion de compra es 💵 ${compra}`);
})
bot.action("promedio", ctx => {
    ctx.reply(`Hola!
    La cotiazcion promedio es 💵 ${avg}`);
})
bot.action("venta", ctx => {
    ctx.reply(`Hola!
    La cotiazcion de venta es 💵 ${venta}`);
})


getCotizacion();
bot.launch();


