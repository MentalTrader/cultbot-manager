const { Telegraf } = require('telegraf');
const { OpenAI } = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

bot.start((ctx) => ctx.reply('✅ Бот работает'));

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Ты полезный ассистент' },
        { role: 'user', content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    ctx.reply(reply);
  } catch (error) {
    console.error('Ошибка OpenAI:', error);
    ctx.reply('Произошла ошибка при обращении к AI. Попробуй позже.');
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
