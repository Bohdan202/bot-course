const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = "5839572110:AAEgLHn1JvlqNBY2EPTT5Y93R1w2lh_6GC4";

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Зараз я загадаю число від 0 до 9, а ти спробуй його відгадати!");
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Відгадай якщо зможеш!", gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Початкове привітання'},
        {command: '/info', description: 'Отримати інформацію про користувача'},
        {command: '/game', description: 'Гра - відгадай число'}
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendMessage(chatId, "Ласкаво просимо в телеграм бот імені Богдана Нікітчука!");
            return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/1.webp");
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "Я тебе не розумію, спробуй ще раз!")
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Вітаю, ти відгадав число ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Нажаль не вгадав, загадане число було ${chats[chatId]}`, againOptions);
        }
        bot.sendMessage(chatId, `Ти обрав число ${data}`);
    })
};

start();