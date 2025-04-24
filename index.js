import { Telegraf } from 'telegraf'
import 'dotenv/config'
import OpenAI from 'openai'

const bot = new Telegraf(process.env.BOT_TOKEN)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

bot.start((ctx) => ctx.reply('✅ Бот работает'))

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }]
    })

    const botReply = completion.choices[0].message.content
    ctx.reply(botReply)
  } catch (error) {
    console.error('Ошибка при запросе к OpenAI:', error)
    ctx.reply('Произошла ошибка при обработке запроса')
  }
})

bot.launch()
console.log('✅ CultBot Assistant запущен (polling)')
