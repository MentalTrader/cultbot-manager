const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

bot.on('text', async (ctx) => {
  try {
    const userMessage = ctx.message.text;
    await ctx.reply('⏳ Думаю...');

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userMessage }],
    });

    const botReply = response.data.choices[0].message.content;
    await ctx.reply(botReply);
  } catch (err) {
    console.error('Ошибка:', err);
    await ctx.reply('❌ Произошла ошибка. Попробуй позже.');
  }
});

(async () => {
  try {
    await bot.telegram.deleteWebhook();
    await bot.launch();
    console.log('✅ Бот запущен');
  } catch (err) {
    console.error('❌ Ошибка запуска бота:', err);
  }
})();
