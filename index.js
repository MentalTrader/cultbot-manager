import { Telegraf } from 'telegraf'
import { Configuration, OpenAIApi } from 'openai'
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT_TOKEN)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

bot.start((ctx) => {
  ctx.reply('✅ Бот работает')
})

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Ты дружелюбный Telegram-бот, помощник по вопросам бизнеса, жизни и стратегии.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ]
    })

    const reply = response.data.choices[0].message.content
    ctx.reply(reply)
  } catch (err) {
    console.error('Ошибка OpenAI:', err)
    ctx.reply('❌ Произошла ошибка при обращении к OpenAI')
  }
})

bot.launch()
  .then(() => {
    console.log('✅ CultBot Assistant запущен (polling)')
  })
  .catch((err) => {
    console.error('❌ Ошибка запуска бота:', err)
  })
