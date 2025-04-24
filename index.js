const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.data.choices[0].message.content;
    ctx.reply(reply);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    ctx.reply('Произошла ошибка при обращении к ИИ. Попробуй ещё раз позже.');
  }
});

(async () => {
  try {
    await bot.telegram.deleteWebhook();
    await bot.launch();
    console.log('✅ CultBot Assistant запущен (polling)');
  } catch (err) {
    console.error('❌ Ошибка запуска бота:', err);
  }
})();