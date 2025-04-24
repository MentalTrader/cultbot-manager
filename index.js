const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('✅ Бот работает'))
bot.command('ping', (ctx) => ctx.reply('🏓 Pong'))

;(async () => {
  try {
    await bot.telegram.deleteWebhook()
    await bot.launch({ dropPendingUpdates: true })
    console.log('✅ Тестовый бот запущен и слушает команды')
  } catch (err) {
    console.error('❌ Ошибка запуска:', err)
  }
})()
