import { Bot, session } from "grammy";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();
const { BOT_TOKEN, FORWARD_FROM, FORWARD_TO, ADMIN_ID } = process.env;

const bot = new Telegraf(BOT_TOKEN);
bot.command("start", (ctx) => {
  console.log(ctx.from);
});
bot.on(":forward_date", async (ctx) => {
  ctx.copyMessage(FORWARD_TO);
});

bot.on("channel_post", async (ctx) => {
  const { sender_chat, message_id } = ctx.update.channel_post;
  if (ctx.update.channel_post.sender_chat.id === parseInt(FORWARD_FROM)) {
    ctx.telegram.copyMessage(FORWARD_TO, sender_chat.id, message_id);
  } else {
    console.log("id won't match");
    console.log(ctx.update.channel_post.sender_chat.id);
    console.log(FORWARD_FROM);
  }
});
bot.launch({
  webhook: {
    domain: "https://sausy-files-forwarder.onrender.com",
    port: process.env.PORT,
  },
});
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
