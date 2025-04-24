// index.js с контекстом
import { Telegraf } from 'telegraf'
import 'dotenv/config'
import OpenAI from 'openai'

const bot = new Telegraf(process.env.BOT_TOKEN)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const userContexts = {} // сохраняем сообщения по user ID

bot.start((ctx) => ctx.reply('✅ Бот работает'))

bot.on('text', async (ctx) => {
  const userId = ctx.from.id
  const userMessage = ctx.message.text

  // Инициализация истории пользователя, если её нет
  if (!userContexts[userId]) {
    userContexts[userId] = []
  }

  // Добавляем новое сообщение пользователя в историю
  userContexts[userId].push({ role: 'user', content: userMessage })

  // Обрезаем историю до последних 6 сообщений
  if (userContexts[userId].length > 6) {
    userContexts[userId] = userContexts[userId].slice(-6)
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Ты умный Telegram-бот, помогаешь по задачам, вопросам и стратегиям' },
        ...userContexts[userId]
      ]
    })

    const botReply = completion.choices[0].message.content

    // Добавляем ответ ассистента в историю
    userContexts[userId].push({ role: 'assistant', content: botReply })

    ctx.reply(botReply)
  } catch (error) {
    console.error('Ошибка OpenAI:', error)
    ctx.reply('Произошла ошибка при обращении к ИИ')
  }
})

bot.launch()
console.log('✅ CultBot Assistant запущен (polling)')
