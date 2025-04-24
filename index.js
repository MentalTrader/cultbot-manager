const { Telegraf } = require('telegraf');
const { Client } = require('@notionhq/client');
const { google } = require('googleapis');

const bot = new Telegraf(process.env.BOT_TOKEN);
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_PRIVATE_KEY });

const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;

bot.command('план', async (ctx) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const res = await calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID,
    timeMin: startOfDay,
    timeMax: endOfDay,
    singleEvents: true,
    orderBy: 'startTime'
  });

  const events = res.data.items;
  if (!events.length) return ctx.reply('На сегодня задач нет');

  const message = events.map(e => `📍 ${e.summary} — ${e.start.dateTime || e.start.date}`).join('\n');
  ctx.reply(message);
});

bot.command('новая_идея', async (ctx) => {
  const text = ctx.message.text.replace('/новая_идея', '').trim();
  if (!text) return ctx.reply('Напиши идею после команды');

  await notion.pages.create({
    parent: { page_id: NOTION_PAGE_ID },
    properties: {
      title: {
        title: [{ text: { content: text } }]
      }
    }
  });

  ctx.reply('💡 Идея записана в Notion');
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
