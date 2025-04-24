// index.js с OpenAI и Google Calendar
import { Telegraf } from 'telegraf'
import 'dotenv/config'
import OpenAI from 'openai'
import { google } from 'googleapis'

const bot = new Telegraf(process.env.BOT_TOKEN)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const userContexts = {}

bot.start((ctx) => ctx.reply('✅ Бот работает'))

bot.command('план', async (ctx) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar.readonly']
  )

  const calendar = google.calendar({ version: 'v3', auth })

  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  try {
    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime'
    })

    const events = res.data.items
    if (!events.length) return ctx.reply('📭 На сегодня задач нет')

    const message = events.map(e => `🕒 ${e.summary} — ${e.start.dateTime || e.start.date}`).join('\n')
    ctx.reply(message)
  } catch (err) {
    console.error('Ошибка при получении событий из календаря:', err)
    ctx.reply('❌ Не удалось получить задачи из Google Calendar')
  }
})

bot.on('text', async (ctx) => {
  const userId = ctx.from.id
  const userMessage = ctx.message.text
  if (!userContexts[userId]) userContexts[userId] = []
  userContexts[userId].push({ role: 'user', content: userMessage })
  if (userContexts[userId].length > 6) userContexts[userId] = userContexts[userId].slice(-6)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Ты умный Telegram-бот, помогаешь по задачам, вопросам и стратегиям' },
        ...userContexts[userId]
      ]
    })

    const botReply = completion.choices[0].message.content
    userContexts[userId].push({ role: 'assistant', content: botReply })
    ctx.reply(botReply)
  } catch (error) {
    console.error('Ошибка OpenAI:', error)
    ctx.reply('Произошла ошибка при обращении к ИИ')
  }
})

bot.launch()
console.log('✅ CultBot Assistant запущен (polling)')
