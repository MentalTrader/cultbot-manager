import { Telegraf } from 'telegraf'

// Получаем токен из переменной окружения
const bot = new Telegraf(process.env.BOT_TOKEN)

// Ответ на команду /start
bot.start((ctx) => ctx.reply('✅ Бот работает'))

// Ответ на любые текстовые сообщения
bot.on('text', (ctx) => {
  ctx.reply(`Ты написал: ${ctx.message.text}`)
})

// Запуск бота с polling и удалением старого вебхука
try {
  await bot.telegram.deleteWebhook()
  await bot.launch()
  console.log('✅ CultBot Assistant запущен (polling)')
} catch (err) {
  console.error('❌ Ошибка запуска бота:', err)
}
