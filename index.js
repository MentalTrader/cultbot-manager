const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('✅ Бот работает'));
bot.help((ctx) => ctx.reply('Я помогу тебе, просто напиши команду.'));

(async () => {
  try {
    await bot.telegram.deleteWebhook(); // отключаем webhook, если он был
    await bot.launch(); // запускаем в режиме polling
    console.log('✅ CultBot Assistant запущен (polling)');
  } catch (err) {
    console.error('❌ Ошибка запуска бота:', err);
  }
})();
